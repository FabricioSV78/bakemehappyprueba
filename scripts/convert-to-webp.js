import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputFolder = path.resolve("public/images");
const outputFolder = path.resolve("public/images/webp");
const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

function collectImageFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (absolutePath === outputFolder) {
        return [];
      }

      return collectImageFiles(absolutePath);
    }

    return supportedExtensions.has(path.extname(entry.name).toLowerCase())
      ? [absolutePath]
      : [];
  });
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

const imageFiles = collectImageFiles(inputFolder);

for (const inputPath of imageFiles) {
  const relativePath = path.relative(inputFolder, inputPath);
  const relativeOutputPath = relativePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const outputPath = path.join(outputFolder, relativeOutputPath);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath).webp({ quality: 95 }).toFile(outputPath);

  console.log(`Convertido: ${relativePath} -> ${relativeOutputPath}`);
}

console.log("Conversion terminada.");
