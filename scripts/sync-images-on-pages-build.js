import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const syncScript = path.join(scriptDirectory, "sync-images-to-r2.js");

function isDisabled(value) {
  return ["0", "false", "no", "off"].includes(value?.trim().toLowerCase());
}

function validatePublicAssetUrl(value) {
  if (!value?.trim()) {
    throw new Error(
      "Falta VITE_R2_PUBLIC_URL en Cloudflare Pages. Configura el dominio publico real del bucket antes de activar la sincronizacion automatica.",
    );
  }

  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("VITE_R2_PUBLIC_URL debe comenzar con https:// en Cloudflare Pages.");
  }

  if (url.hostname === "assets.tudominio.com") {
    throw new Error(
      "VITE_R2_PUBLIC_URL todavia usa assets.tudominio.com, que es solo un ejemplo. Reemplazalo por el dominio real del bucket.",
    );
  }
}

function runSync() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [syncScript], {
      cwd: projectDirectory,
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `La sincronizacion automatica de R2 termino por la senal ${signal}.`
            : `La sincronizacion automatica de R2 fallo con el codigo ${code}.`,
        ),
      );
    });
  });
}

async function main() {
  if (process.env.CF_PAGES !== "1") {
    process.stdout.write(
      "Sincronizacion R2 omitida: esta compilacion no se ejecuta en Cloudflare Pages.\n",
    );
    return;
  }

  if (isDisabled(process.env.R2_SYNC_ON_BUILD)) {
    process.stdout.write(
      "Sincronizacion R2 desactivada mediante R2_SYNC_ON_BUILD.\n",
    );
    return;
  }

  const productionBranch = process.env.R2_SYNC_BRANCH?.trim() || "main";
  const currentBranch = process.env.CF_PAGES_BRANCH?.trim();

  if (currentBranch && currentBranch !== productionBranch) {
    process.stdout.write(
      `Sincronizacion R2 omitida en la rama ${currentBranch}; solo se ejecuta en ${productionBranch}.\n`,
    );
    return;
  }

  const missingCredentials = [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_TOKEN",
  ].filter((name) => !process.env[name]?.trim());

  if (missingCredentials.length > 0) {
    throw new Error(
      `Faltan credenciales para sincronizar R2 desde Pages: ${missingCredentials.join(", ")}.`,
    );
  }

  validatePublicAssetUrl(process.env.VITE_R2_PUBLIC_URL);

  process.stdout.write(
    `Sincronizando imagenes con R2 antes de compilar la rama ${currentBranch || productionBranch}...\n`,
  );
  await runSync();
}

main().catch((error) => {
  process.stderr.write(`No se puede publicar sin sincronizar R2: ${error.message}\n`);
  process.exitCode = 1;
});
