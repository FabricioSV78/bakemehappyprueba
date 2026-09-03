import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assetVersions } from "../src/data/assetVersions.generated.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");

async function readOptional(relativePath) {
  try {
    return await readFile(path.join(projectDirectory, relativePath), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
}

function parseEnvironment(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function verifyLocalFallbacks() {
  const missingAssets = [];

  await Promise.all(
    Object.keys(assetVersions).map(async (publicPath) => {
      try {
        await access(path.join(projectDirectory, "public", publicPath.slice(1)));
      } catch {
        missingAssets.push(publicPath);
      }
    }),
  );

  assert(
    missingAssets.length === 0,
    `Faltan ${missingAssets.length} respaldo(s) local(es): ${missingAssets.slice(0, 3).join(", ")}`,
  );

  return Object.keys(assetVersions).length;
}

async function main() {
  const wranglerConfig = JSON.parse(
    await readFile(path.join(projectDirectory, "wrangler.jsonc"), "utf8"),
  );
  const privateBinding = wranglerConfig.r2_buckets?.find(
    (binding) => binding.binding === "ORDER_UPLOADS",
  );

  assert(privateBinding, "Falta el binding privado ORDER_UPLOADS en wrangler.jsonc.");
  assert(
    privateBinding.bucket_name === "bake-me-happy-private-uploads",
    "ORDER_UPLOADS no apunta a bake-me-happy-private-uploads.",
  );
  assert(
    wranglerConfig.vars?.UPLOAD_LINK_TTL_SECONDS === "86400",
    "UPLOAD_LINK_TTL_SECONDS debe ser 86400 (24 horas).",
  );
  assert(
    wranglerConfig.vars?.MAX_UPLOAD_BYTES === "8388608",
    "MAX_UPLOAD_BYTES debe ser 8388608 (8 MB).",
  );

  const gitignore = await readFile(path.join(projectDirectory, ".gitignore"), "utf8");
  assert(/^\.dev\.vars$/m.test(gitignore), ".dev.vars debe estar protegido por .gitignore.");
  assert(/^\.env$/m.test(gitignore), ".env debe estar protegido por .gitignore.");

  const headers = await readFile(
    path.join(projectDirectory, "public", "_headers"),
    "utf8",
  );
  assert(
    /\/images\/\*[\s\S]*max-age=31536000[\s\S]*immutable/.test(headers),
    "Falta cache inmutable para los respaldos locales de /images/*.",
  );

  const localAssetCount = await verifyLocalFallbacks();
  const localEnvironment = parseEnvironment(await readOptional(".env"));
  const configuredPublicUrl = localEnvironment.VITE_R2_PUBLIC_URL;

  if (configuredPublicUrl) {
    const url = new URL(configuredPublicUrl);
    assert(
      url.protocol === "https:" || url.hostname === "localhost",
      "VITE_R2_PUBLIC_URL debe usar HTTPS en produccion.",
    );
  }

  const localSecrets = parseEnvironment(await readOptional(".dev.vars"));
  if (localSecrets.UPLOAD_LINK_SECRET) {
    assert(
      localSecrets.UPLOAD_LINK_SECRET.length >= 32,
      "UPLOAD_LINK_SECRET local debe tener al menos 32 caracteres.",
    );
  }

  process.stdout.write(
    [
      "Configuracion R2 local verificada:",
      `- ${localAssetCount} imagen(es) con respaldo local`,
      "- ORDER_UPLOADS enlazado al bucket privado",
      configuredPublicUrl
        ? `- R2 publico activado localmente en ${new URL(configuredPublicUrl).origin}`
        : "- R2 publico desactivado en .env; se usaran archivos locales",
      localSecrets.UPLOAD_LINK_SECRET
        ? "- secreto local de enlaces temporales presente"
        : "- sin .dev.vars local; las subidas solo funcionaran en Cloudflare",
      "",
    ].join("\n"),
  );
}

main().catch((error) => {
  process.stderr.write(`Configuracion R2 invalida: ${error.message}\n`);
  process.exitCode = 1;
});
