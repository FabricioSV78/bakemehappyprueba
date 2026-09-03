import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assetVersions } from "../src/data/assetVersions.generated.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const publicDirectory = path.join(projectDirectory, "public");
const imagesDirectory = path.join(publicDirectory, "images");
const wranglerCli = path.join(
  projectDirectory,
  "node_modules",
  "wrangler",
  "bin",
  "wrangler.js",
);
const defaultBucketName = "bake-me-happy-assets";
const manifestObjectKey = "_meta/bake-me-happy-assets.json";
const supportedTypes = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

function getOptions(argv) {
  const forceAll = argv.includes("--force-all");
  const bucketFlagIndex = argv.indexOf("--bucket");
  const positionalBucket = argv.find((argument) => !argument.startsWith("--"));
  const bucketName = bucketFlagIndex >= 0
    ? argv[bucketFlagIndex + 1]
    : positionalBucket ?? process.env.R2_PUBLIC_BUCKET_NAME ?? defaultBucketName;

  if (!bucketName || bucketName.startsWith("--")) {
    throw new Error("Indica un nombre valido despues de --bucket.");
  }

  return { bucketName, forceAll };
}

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findImages(fullPath);
      if (!supportedTypes.has(path.extname(entry.name).toLowerCase())) return [];

      const publicPath = `/${path
        .relative(publicDirectory, fullPath)
        .split(path.sep)
        .join("/")}`;
      return assetVersions[publicPath] ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function runWrangler(args, { inheritOutput = true } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [wranglerCli, ...args], {
      cwd: projectDirectory,
      env: process.env,
      stdio: inheritOutput ? "inherit" : ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    if (!inheritOutput) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }

    child.on("error", reject);
    child.on("exit", (code) => resolve({ code, stdout, stderr }));
  });
}

async function loadRemoteManifest(bucketName, temporaryDirectory) {
  const manifestPath = path.join(temporaryDirectory, "remote-manifest.json");
  const result = await runWrangler(
    [
      "r2",
      "object",
      "get",
      `${bucketName}/${manifestObjectKey}`,
      "--file",
      manifestPath,
      "--remote",
    ],
    { inheritOutput: false },
  );

  if (result.code !== 0) return {};

  try {
    const parsed = JSON.parse(await readFile(manifestPath, "utf8"));
    return parsed?.assets && typeof parsed.assets === "object"
      ? parsed.assets
      : {};
  } catch {
    process.stdout.write(
      "El manifiesto remoto no era valido; se reparara con una sincronizacion completa.\n",
    );
    return {};
  }
}

async function uploadImage(filePath, index, total, bucketName) {
  const extension = path.extname(filePath).toLowerCase();
  const objectKey = path.relative(publicDirectory, filePath).split(path.sep).join("/");
  const result = await runWrangler([
    "r2",
    "object",
    "put",
    `${bucketName}/${objectKey}`,
    "--file",
    filePath,
    "--content-type",
    supportedTypes.get(extension),
    "--cache-control",
    "public, max-age=31536000, immutable",
    "--remote",
    "--force",
  ]);

  process.stdout.write(`[${index + 1}/${total}] Subiendo ${objectKey}\n`);
  if (result.code !== 0) {
    throw new Error(`No se pudo subir ${objectKey} (codigo ${result.code}).`);
  }
}

async function deleteImage(objectKey, index, total, bucketName) {
  const result = await runWrangler([
    "r2",
    "object",
    "delete",
    `${bucketName}/${objectKey}`,
    "--remote",
    "--force",
  ]);

  process.stdout.write(`[${index + 1}/${total}] Eliminando ${objectKey}\n`);
  if (result.code !== 0) {
    throw new Error(`No se pudo eliminar ${objectKey} (codigo ${result.code}).`);
  }
}

async function uploadManifest(bucketName, localAssets, temporaryDirectory) {
  const manifestPath = path.join(temporaryDirectory, "next-manifest.json");
  const contents = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    assets: localAssets,
  };

  await writeFile(manifestPath, `${JSON.stringify(contents, null, 2)}\n`, "utf8");
  const result = await runWrangler([
    "r2",
    "object",
    "put",
    `${bucketName}/${manifestObjectKey}`,
    "--file",
    manifestPath,
    "--content-type",
    "application/json",
    "--cache-control",
    "no-store",
    "--remote",
    "--force",
  ]);

  if (result.code !== 0) {
    throw new Error(`No se pudo actualizar el manifiesto R2 (codigo ${result.code}).`);
  }
}

async function runConcurrently(items, worker, concurrency = 3) {
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        await worker(items[index], index, items.length);
      }
    },
  );

  await Promise.all(workers);
}

async function main() {
  const { bucketName, forceAll } = getOptions(process.argv.slice(2));
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "bmh-r2-"));

  try {
    const images = (await findImages(imagesDirectory)).sort((left, right) =>
      left.localeCompare(right, "es"),
    );
    const localAssets = Object.fromEntries(
      images.map((filePath) => {
        const publicPath = `/${path
          .relative(publicDirectory, filePath)
          .split(path.sep)
          .join("/")}`;
        return [publicPath.slice(1), assetVersions[publicPath]];
      }),
    );

    if (images.length === 0) {
      process.stdout.write("No se encontraron imagenes para sincronizar.\n");
      return;
    }

    const remoteAssets = await loadRemoteManifest(bucketName, temporaryDirectory);
    const changedImages = forceAll
      ? images
      : images.filter((filePath) => {
          const objectKey = path
            .relative(publicDirectory, filePath)
            .split(path.sep)
            .join("/");
          return remoteAssets[objectKey] !== localAssets[objectKey];
        });
    const staleObjectKeys = Object.keys(remoteAssets).filter(
      (objectKey) => !localAssets[objectKey],
    );

    process.stdout.write(
      `R2 ${bucketName}: ${changedImages.length} por subir, ${staleObjectKeys.length} obsoleta(s) por eliminar y ${images.length - changedImages.length} sin cambios.\n`,
    );

    await runConcurrently(changedImages, (filePath, index, total) =>
      uploadImage(filePath, index, total, bucketName),
    );
    await runConcurrently(staleObjectKeys, (objectKey, index, total) =>
      deleteImage(objectKey, index, total, bucketName),
    );
    await uploadManifest(bucketName, localAssets, temporaryDirectory);

    process.stdout.write(
      "Sincronizacion terminada. R2 quedo actualizado y las copias locales se conservaron.\n",
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
