import { createHash } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  getResponsiveWidthsForSource,
  RESPONSIVE_IMAGE_WIDTHS,
} from "../src/data/imageDelivery.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const publicDirectory = path.join(projectDirectory, "public");
const productImagesDirectory = path.join(
  publicDirectory,
  "images",
  "webp",
);
const productGalleryDirectories = [
  path.join(productImagesDirectory, "TORTAS"),
  path.join(productImagesDirectory, "COMPLEMENTOS"),
];
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
const responsiveDirectoryName = "_responsive";
const allResponsiveWidths = [
  ...new Set(Object.values(RESPONSIVE_IMAGE_WIDTHS).flat()),
];
const responsiveImagePattern = new RegExp(
  `-(?:${allResponsiveWidths.join("|")})\\.webp$`,
  "i",
);

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

function getResponsiveWidths(filePath) {
  const relativePath = path
    .relative(productImagesDirectory, filePath)
    .split(path.sep)
    .join("/");

  return getResponsiveWidthsForSource(`/${relativePath}`);
}

function getResponsiveTargetPath(sourcePath, width) {
  const extension = path.extname(sourcePath);
  const baseName = path.basename(sourcePath, extension);

  return path.join(
    path.dirname(sourcePath),
    responsiveDirectoryName,
    `${baseName}-${width}.webp`,
  );
}

async function findGeneratedResponsiveImages(directory) {
  if (!(await pathExists(directory))) return [];

  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findGeneratedResponsiveImages(fullPath);
      }

      return path.basename(path.dirname(fullPath)) === responsiveDirectoryName &&
        responsiveImagePattern.test(entry.name)
        ? [fullPath]
        : [];
    }),
  );

  return files.flat();
}

async function prepareResponsiveImages(previousBuildState, nextBuildState) {
  const webpImages = await findImages(productImagesDirectory, /\.webp$/i);
  const sourceImages = webpImages.filter(
    (filePath) => !filePath.split(path.sep).includes(responsiveDirectoryName),
  );
  const desiredTargets = new Set();
  let preparedImages = 0;

  for (const sourcePath of sourceImages) {
    const widths = getResponsiveWidths(sourcePath);
    if (widths.length === 0) continue;

    const [sourceHash, metadata] = await Promise.all([
      getFileHash(sourcePath),
      sharp(sourcePath).metadata(),
    ]);

    for (const width of widths) {
      if (!metadata.width || metadata.width <= width) continue;

      const targetPath = getResponsiveTargetPath(sourcePath, width);
      const targetKey = path
        .relative(projectDirectory, targetPath)
        .split(path.sep)
        .join("/");
      const stateKey = `responsive:${targetKey}`;
      const targetExists = await pathExists(targetPath);
      const sourceChanged =
        !targetExists || previousBuildState[stateKey] !== sourceHash;

      desiredTargets.add(path.resolve(targetPath));

      if (sourceChanged) {
        await mkdir(path.dirname(targetPath), { recursive: true });
        await sharp(sourcePath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4, smartSubsample: true })
          .toFile(targetPath);
        preparedImages += 1;
      }

      nextBuildState[stateKey] = sourceHash;
    }
  }

  const generatedImages = await findGeneratedResponsiveImages(
    productImagesDirectory,
  );
  for (const generatedPath of generatedImages) {
    if (!desiredTargets.has(path.resolve(generatedPath))) {
      await rm(generatedPath);
    }
  }

  return preparedImages;
}

async function findCompleteGalleryFolders(directory) {
  if (!(await pathExists(directory))) return [];

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
  const galleryFolders = (
    await Promise.all(
      productGalleryDirectories.map((directory) =>
        findCompleteGalleryFolders(directory),
      ),
    )
  ).flat();
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
  const sources = await findImages(productImagesDirectory, numberedSourceImage);
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
  const responsiveImages = await prepareResponsiveImages(
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
  process.stdout.write(
    responsiveImages > 0
      ? `${responsiveImages} variante(s) responsiva(s) preparada(s).\n`
      : "Las variantes responsivas ya estan preparadas.\n",
  );
  process.stdout.write(`${galleryCount} galeria(s) completa(s) detectada(s).\n`);
}

main().catch((error) => {
  process.stderr.write(`No se pudieron preparar las imagenes: ${error.message}\n`);
  process.exitCode = 1;
});
