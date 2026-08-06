import sharp from "sharp";
import { Buffer } from "node:buffer";
import { resolve } from "node:path";

const logoDirectory = resolve("public/images/webp/LOGO");
const sourcePath = resolve(logoDirectory, "Logo secundario.jpeg");
const positivePath = resolve(
  logoDirectory,
  "logo-horizontal-transparent.webp",
);
const negativePath = resolve(
  logoDirectory,
  "logo-horizontal-negative-transparent.webp",
);

const source = sharp(sourcePath).removeAlpha();
const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
const positivePixels = Buffer.alloc(info.width * info.height * 4);
const negativePixels = Buffer.alloc(info.width * info.height * 4);

for (let sourceIndex = 0, outputIndex = 0; sourceIndex < data.length; sourceIndex += info.channels, outputIndex += 4) {
  const red = data[sourceIndex];
  const green = data[sourceIndex + 1];
  const blue = data[sourceIndex + 2];
  // El JPEG usa varios blancos muy cercanos por compresión. Medir la
  // distancia al blanco evita halos y conserva el azul, lavanda y melón.
  const distanceFromWhite = 255 - Math.min(red, green, blue);
  const alpha = Math.max(
    0,
    Math.min(255, Math.round(((distanceFromWhite - 18) / 42) * 255)),
  );

  positivePixels[outputIndex] = red;
  positivePixels[outputIndex + 1] = green;
  positivePixels[outputIndex + 2] = blue;
  positivePixels[outputIndex + 3] = alpha;

  negativePixels[outputIndex] = 255;
  negativePixels[outputIndex + 1] = 255;
  negativePixels[outputIndex + 2] = 255;
  const isLavenderCountershape =
    red > 100 && blue > 160 && blue - red > 20 && blue - green > 8;
  negativePixels[outputIndex + 3] = isLavenderCountershape ? 0 : alpha;
}

const transparentBackground = { r: 0, g: 0, b: 0, alpha: 0 };
const outputOptions = {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
};

async function writeLogo(pixels, outputPath) {
  await sharp(pixels, outputOptions)
    .trim({ background: transparentBackground, threshold: 2 })
    .extend({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
      background: transparentBackground,
    })
    .webp({ quality: 96, alphaQuality: 100 })
    .toFile(outputPath);
}

await Promise.all([
  writeLogo(positivePixels, positivePath),
  writeLogo(negativePixels, negativePath),
]);

console.log("Brand logo assets prepared successfully.");
