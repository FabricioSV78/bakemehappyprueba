import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const publicDirectory = path.join(projectDirectory, "public");
const imagesDirectory = path.join(publicDirectory, "images");
const outputPath = path.join(
  projectDirectory,
  "src",
  "data",
  "assetVersions.generated.js",
);
const supportedExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const sourceExtensions = new Set([".jpeg", ".jpg", ".png"]);
const retainedSourceAssets = new Set([
  "/images/webp/LOGO/Logo principal.png",
]);

async function findAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findAssets(fullPath);

      return supportedExtensions.has(path.extname(entry.name).toLowerCase())
        ? [fullPath]
        : [];
    }),
  );

  return assets.flat();
}

async function getContentVersion(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex").slice(0, 12);
}

function toPublicPath(filePath) {
  return `/${path.relative(publicDirectory, filePath).split(path.sep).join("/")}`;
}

function isDeployableAsset(filePath) {
  const publicPath = toPublicPath(filePath);
  const extension = path.extname(filePath).toLowerCase();

  return !sourceExtensions.has(extension) || retainedSourceAssets.has(publicPath);
}

async function getAssetRecord(filePath) {
  return {
    path: toPublicPath(filePath),
    version: await getContentVersion(filePath),
  };
}

async function main() {
  const assetPaths = (await findAssets(imagesDirectory)).filter(isDeployableAsset);
  const assetRecords = await Promise.all(assetPaths.map(getAssetRecord));
  const versionEntries = assetRecords.map((asset) => [
    asset.path,
    asset.version,
  ]);
  const versions = Object.fromEntries(
    versionEntries.sort(([left], [right]) => left.localeCompare(right, "es")),
  );
  const contents = [
    "// Archivo generado por scripts/generate-asset-versions.js.",
    "// No editar manualmente.",
    `export const assetVersions = ${JSON.stringify(versions, null, 2)};`,
    "",
  ].join("\n");

  await writeFile(outputPath, contents, "utf8");
  process.stdout.write(
    `${versionEntries.length} recurso(s) optimizado(s) y versionado(s).\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `No se pudieron versionar los recursos: ${error.message}\n`,
  );
  process.exitCode = 1;
});
