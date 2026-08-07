import { access, readdir, stat, writeFile } from "node:fs/promises";
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

async function findSourceImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const sources = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findSourceImages(fullPath);
      return numberedSourceImage.test(entry.name) ? [fullPath] : [];
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

async function main() {
  const sources = await findSourceImages(cakesDirectory);
  let convertedImages = 0;

  for (const sourcePath of sources) {
    const targetPath = sourcePath.replace(/\.(?:jpe?g|png)$/i, ".webp");
    if (!(await sourceIsNewer(sourcePath, targetPath))) continue;

    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 84, effort: 4 })
      .toFile(targetPath);
    convertedImages += 1;
    process.stdout.write(
      `Imagen preparada: ${path.relative(projectDirectory, targetPath)}\n`,
    );
  }

  const galleryCount = await writeProductImageManifest();

  process.stdout.write(
    convertedImages > 0
      ? `${convertedImages} imagen(es) convertida(s) a WebP.\n`
      : "Las imágenes numeradas ya están preparadas.\n",
  );
  process.stdout.write(
    `${galleryCount} galería(s) completa(s) detectada(s).\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`No se pudieron preparar las imágenes: ${error.message}\n`);
  process.exitCode = 1;
});
