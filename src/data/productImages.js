import { productImageFolders } from "./productImageFolders.generated.js";

const CAKE_GALLERY_IMAGE_COUNT = 3;
const productImageFolderSet = new Set(productImageFolders);

export function hasNumberedCakeImages(folderPath) {
  return productImageFolderSet.has(folderPath);
}

/**
 * Convención única para las galerías de productos:
 * <carpeta>/1.webp, <carpeta>/2.webp y <carpeta>/3.webp.
 */
export function numberedCakeImages(folderPath, productName) {
  return Array.from(
    { length: CAKE_GALLERY_IMAGE_COUNT },
    (_, index) => {
      const imageNumber = index + 1;

      return {
        src: `${folderPath}/${imageNumber}.webp`,
        alt:
          imageNumber === 1
            ? `${productName} de Bake Me Happy`
            : `Vista ${imageNumber} de ${productName}`,
        position: "center",
      };
    },
  );
}

export function cakeImagesWithFallback(
  folderPath,
  productName,
  fallbackImages,
) {
  if (hasNumberedCakeImages(folderPath)) {
    return numberedCakeImages(folderPath, productName);
  }

  return fallbackImages.map((image, index) => ({
    ...image,
    alt:
      index === 0
        ? `${productName} de Bake Me Happy`
        : `Imagen referencial ${index + 1} de ${productName}`,
  }));
}
