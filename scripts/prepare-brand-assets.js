import sharp from "sharp";
import { Buffer } from "node:buffer";
import { resolve } from "node:path";

const logoDirectory = resolve("public/images/webp/LOGO");
const sourcePath = resolve(logoDirectory, "Logo secundario.jpeg");
const cakeSourcePath = resolve(logoDirectory, "Logo principal.png");
const positivePath = resolve(
  logoDirectory,
  "logo-horizontal-transparent.webp",
);
const negativePath = resolve(
  logoDirectory,
  "logo-horizontal-negative-transparent.webp",
);
const cakePath = resolve(logoDirectory, "logo-cake-transparent.webp");

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

async function writeCakeLogo() {
  const { data: cakePixels, info: cakeInfo } = await sharp(cakeSourcePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = cakeInfo;
  const pixelCount = width * height;
  const background = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  const enqueue = (pixelIndex) => {
    if (background[pixelIndex]) return;
    background[pixelIndex] = 1;
    queue[tail] = pixelIndex;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  const canJoinBackground = (fromPixel, toPixel) => {
    const from = fromPixel * channels;
    const to = toPixel * channels;
    const red = cakePixels[to];
    const green = cakePixels[to + 1];
    const blue = cakePixels[to + 2];

    // El fondo original es lavanda. La conectividad evita eliminar los tonos
    // lavanda del texto, porque están encerrados dentro de la torta azul.
    if (
      red < 135 ||
      green < 140 ||
      blue < 195 ||
      blue < red + 8 ||
      blue < green + 8
    ) {
      return false;
    }

    const redDelta = cakePixels[from] - red;
    const greenDelta = cakePixels[from + 1] - green;
    const blueDelta = cakePixels[from + 2] - blue;

    return (
      redDelta * redDelta +
        greenDelta * greenDelta +
        blueDelta * blueDelta <=
      18 * 18
    );
  };

  while (head < tail) {
    const current = queue[head];
    head += 1;
    const x = current % width;
    const y = Math.floor(current / width);
    const neighbors = [];

    if (x > 0) neighbors.push(current - 1);
    if (x + 1 < width) neighbors.push(current + 1);
    if (y > 0) neighbors.push(current - width);
    if (y + 1 < height) neighbors.push(current + width);

    for (const neighbor of neighbors) {
      if (!background[neighbor] && canJoinBackground(current, neighbor)) {
        enqueue(neighbor);
      }
    }
  }

  const transparentCakePixels = Buffer.alloc(pixelCount * 4);

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const sourceIndex = pixel * channels;
    const outputIndex = pixel * 4;
    transparentCakePixels[outputIndex] = cakePixels[sourceIndex];
    transparentCakePixels[outputIndex + 1] = cakePixels[sourceIndex + 1];
    transparentCakePixels[outputIndex + 2] = cakePixels[sourceIndex + 2];
    transparentCakePixels[outputIndex + 3] = background[pixel] ? 0 : 255;
  }

  await sharp(transparentCakePixels, {
    raw: { width, height, channels: 4 },
  })
    .trim({ background: transparentBackground, threshold: 2 })
    .extend({
      top: 36,
      right: 36,
      bottom: 36,
      left: 36,
      background: transparentBackground,
    })
    .resize(440, 440, {
      fit: "contain",
      background: transparentBackground,
    })
    .webp({ quality: 96, alphaQuality: 100, effort: 6 })
    .toFile(cakePath);
}

await Promise.all([
  writeLogo(positivePixels, positivePath),
  writeLogo(negativePixels, negativePath),
  writeCakeLogo(),
]);

console.log("Brand logo assets prepared successfully.");
