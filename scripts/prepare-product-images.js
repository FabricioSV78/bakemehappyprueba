import { createHash } from "node:crypto";
import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const publicDirectory = path.join(projectDirectory, "public");
const cakesDirectory = path.join(
  publicDirectory,
  "images",
  "webp",
  "TORTAS",
);
const manifestPath = path.join(
  projectDirectory,
  "src",
  "data",
  "productImageFolders.generated.js",
);
const buildStatePath = path.join(
  projectDirectory,
  "src",
  "data",
  "productImageBuildState.generated.json",
);
const numberedSourceImage = /^[123]\.(?:jpe?g|png)$/i;
const expectedGalleryFiles = ["1.webp", "2.webp", "3.webp"];

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sourceIsNewer(sourcePath, targetPath) {
  if (!(await pathExists(targetPath))) return true;

  const [sourceStats, targetStats] = await Promise.all([
    stat(sourcePath),
    stat(targetPath),
  ]);

  return sourceStats.mtimeMs > targetStats.mtimeMs;
}

async function getFileHash(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

async function loadBuildState() {
  try {
    return JSON.parse(await readFile(buildStatePath, "utf8"));
  } catch {
    return {};
  }
}

async function findImages(directory, pattern) {
  if (!(await pathExists(directory))) return [];

  const entries = await readdir(directory, { withFileTypes: true });
  const sources = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findImages(fullPath, pattern);
      return pattern.test(entry.name) ? [fullPath] : [];
    }),
  );

  return sources.flat();
}

async function findCompleteGalleryFolders(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const fileNames = new Set(
    entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
  );
  const childFolders = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => findCompleteGalleryFolders(path.join(directory, entry.name))),
  );
  const currentFolder = expectedGalleryFiles.every((fileName) =>
    fileNames.has(fileName),
  )
    ? [directory]
    : [];

  return [...currentFolder, ...childFolders.flat()];
}

async function writeProductImageManifest() {
  const galleryFolders = await findCompleteGalleryFolders(cakesDirectory);
  const publicPaths = galleryFolders
    .map(
      (folderPath) =>
        `/${path.relative(publicDirectory, folderPath).split(path.sep).join("/")}`,
    )
    .sort((left, right) => left.localeCompare(right, "es"));
  const contents = [
    "// Archivo generado por scripts/prepare-product-images.js.",
    `export const productImageFolders = ${JSON.stringify(publicPaths, null, 2)};`,
    "",
  ].join("\n");

  await writeFile(manifestPath, contents, "utf8");
  return publicPaths.length;
}

async function prepareBaseImages(previousBuildState, nextBuildState) {
  const sources = await findImages(cakesDirectory, numberedSourceImage);
  let convertedImages = 0;

  for (const sourcePath of sources) {
    const targetPath = sourcePath.replace(/\.(?:jpe?g|png)$/i, ".webp");
    const stateKey = `source:${path
      .relative(projectDirectory, sourcePath)
      .split(path.sep)
      .join("/")}`;
    const sourceHash = await getFileHash(sourcePath);
    const targetExists = await pathExists(targetPath);
    const sourceChanged =
      !targetExists ||
      (previousBuildState[stateKey]
        ? previousBuildState[stateKey] !== sourceHash
        : await sourceIsNewer(sourcePath, targetPath));

    if (sourceChanged) {
      await sharp(sourcePath)
        .rotate()
        .webp({ quality: 84, effort: 4 })
        .toFile(targetPath);
      convertedImages += 1;
      process.stdout.write(
        `Imagen preparada: ${path.relative(projectDirectory, targetPath)}\n`,
      );
    }

    nextBuildState[stateKey] = sourceHash;
  }

  return convertedImages;
}

async function main() {
  const previousBuildState = await loadBuildState();
  const nextBuildState = {};
  const convertedImages = await prepareBaseImages(
    previousBuildState,
    nextBuildState,
  );
  const galleryCount = await writeProductImageManifest();

  await writeFile(
    buildStatePath,
    `${JSON.stringify(nextBuildState, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    convertedImages > 0
      ? `${convertedImages} imagen(es) convertida(s) a WebP.\n`
      : "Las imagenes numeradas ya estan preparadas.\n",
  );
  process.stdout.write(`${galleryCount} galeria(s) completa(s) detectada(s).\n`);
}

main().catch((error) => {
  process.stderr.write(`No se pudieron preparar las imagenes: ${error.message}\n`);
  process.exitCode = 1;
});
