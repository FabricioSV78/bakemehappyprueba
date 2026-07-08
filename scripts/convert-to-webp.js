import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputFolder = path.resolve("public/images");
const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

function collectImageFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectImageFiles(absolutePath);
    }

    return supportedExtensions.has(path.extname(entry.name).toLowerCase())
      ? [absolutePath]
      : [];
  });
}

const imageFiles = collectImageFiles(inputFolder);

for (const inputPath of imageFiles) {
  const relativePath = path.relative(inputFolder, inputPath);
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const relativeOutputPath = path.relative(inputFolder, outputPath);

  await sharp(inputPath).webp({ quality: 95 }).toFile(outputPath);

  console.log(`Convertido: ${relativePath} -> ${relativeOutputPath}`);
}

console.log("Conversion terminada.");
