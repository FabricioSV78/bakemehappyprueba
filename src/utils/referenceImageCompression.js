const COMPRESSION_MIN_BYTES = 768 * 1024;
const MAX_IMAGE_EDGE = 2048;
const WEBP_QUALITY = 0.84;
const MINIMUM_SAVINGS_RATIO = 0.95;

function replaceFileExtension(fileName, extension) {
  const baseName = fileName.replace(/\.[^./\\]+$/, "") || "foto-referencia";
  return `${baseName}.${extension}`;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("No se pudo generar la imagen optimizada."));
      },
      type,
      quality,
    );
  });
}

async function decodeImage(file) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";

  try {
    image.src = objectUrl;
    await image.decode();

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

async function compressReferenceImage(file) {
  const decoded = await decodeImage(file);

  try {
    if (!decoded.width || !decoded.height) return file;

    const scale = Math.min(
      1,
      MAX_IMAGE_EDGE / Math.max(decoded.width, decoded.height),
    );
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return file;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(decoded.source, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/webp", WEBP_QUALITY);
    const hasUsefulSavings = blob.size < file.size * MINIMUM_SAVINGS_RATIO;
    if (!hasUsefulSavings || blob.type !== "image/webp") return file;

    return new File(
      [blob],
      replaceFileExtension(file.name, "webp"),
      {
        type: "image/webp",
        lastModified: file.lastModified,
      },
    );
  } finally {
    decoded.release();
  }
}

export async function optimizeReferenceImage(file) {
  if (!(file instanceof Blob) || file.size < COMPRESSION_MIN_BYTES) return file;

  try {
    return await compressReferenceImage(file);
  } catch {
    return file;
  }
}
