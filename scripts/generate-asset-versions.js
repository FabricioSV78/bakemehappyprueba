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

async function main() {
  const assetPaths = await findAssets(imagesDirectory);
  const versionEntries = await Promise.all(
    assetPaths.map(async (filePath) => [
      `/${path.relative(publicDirectory, filePath).split(path.sep).join("/")}`,
      await getContentVersion(filePath),
    ]),
  );
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
    `${versionEntries.length} recurso(s) versionado(s) por contenido.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `No se pudieron versionar los recursos: ${error.message}\n`,
  );
  process.exitCode = 1;
});
