import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assetVersions } from "../src/data/assetVersions.generated.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.join(projectDirectory, "dist");
const distImagesDirectory = path.join(distDirectory, "images");
const deployableAssetPaths = new Set(Object.keys(assetVersions));

async function findFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? findFiles(fullPath) : [fullPath];
    }),
  );

  return files.flat();
}

async function main() {
  const files = await findFiles(distImagesDirectory);
  let removedFiles = 0;
  let removedBytes = 0;

  for (const filePath of files) {
    const publicPath = `/${path
      .relative(distDirectory, filePath)
      .split(path.sep)
      .join("/")}`;
    if (deployableAssetPaths.has(publicPath)) continue;

    removedBytes += (await stat(filePath)).size;
    await rm(filePath);
    removedFiles += 1;
  }

  process.stdout.write(
    `${removedFiles} fuente(s) sin uso excluida(s) de dist (${(
      removedBytes /
      1024 /
      1024
    ).toFixed(2)} MB).\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `No se pudieron limpiar los recursos de produccion: ${error.message}\n`,
  );
  process.exitCode = 1;
});
