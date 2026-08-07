import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

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
const bucketName = process.argv[2] || "bake-me-happy-assets";
const supportedTypes = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findImages(fullPath);
      return supportedTypes.has(path.extname(entry.name).toLowerCase())
        ? [fullPath]
        : [];
    }),
  );

  return files.flat();
}

function insertVersionInFileName(filePath, version) {
  const extension = path.extname(filePath);
  return `${filePath.slice(0, -extension.length)}.${version}${extension}`;
}

async function uploadImage(filePath, index, total) {
  const extension = path.extname(filePath).toLowerCase();
  const objectKey = path.relative(publicDirectory, filePath).split(path.sep).join("/");
  const contents = await readFile(filePath);
  const version = createHash("sha256")
    .update(contents)
    .digest("hex")
    .slice(0, 12);
  const versionedObjectKey = insertVersionInFileName(objectKey, version);
  const objectPath = `${bucketName}/${versionedObjectKey}`;
  const args = [
    wranglerCli,
    "r2",
    "object",
    "put",
    objectPath,
    "--file",
    filePath,
    "--content-type",
    supportedTypes.get(extension),
    "--cache-control",
    "public, max-age=31536000, immutable",
    "--remote",
    "--force",
  ];

  process.stdout.write(`[${index + 1}/${total}] ${versionedObjectKey}\n`);

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: projectDirectory,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`No se pudo subir ${objectKey} (código ${code}).`));
    });
  });
}

async function main() {
  const images = await findImages(imagesDirectory);

  if (images.length === 0) {
    process.stdout.write("No se encontraron imágenes para sincronizar.\n");
    return;
  }

  process.stdout.write(
    `Sincronizando ${images.length} imágenes con R2 (${bucketName})...\n`,
  );

  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(3, images.length) }, async () => {
    while (nextIndex < images.length) {
      const index = nextIndex;
      nextIndex += 1;
      await uploadImage(images[index], index, images.length);
    }
  });

  await Promise.all(workers);
  process.stdout.write("Sincronización terminada. Los archivos locales se conservaron.\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
