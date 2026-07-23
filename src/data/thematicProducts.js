const THEMATIC_BASE_PATH = "/images/webp/TORTAS/tortas tematicas";

const fallbackImages = [
  {
    src: "/images/webp/hero 1.webp",
    position: "center",
  },
  {
    src: "/images/webp/hero 2.webp",
    position: "center",
  },
  {
    src: "/images/webp/hero 3.webp",
    position: "center",
  },
];

const foldersWithImages = new Set([
  "Camino de mariposas",
  "Camino de mariposas 2",
  "Corazón con frambuesas",
  "Corazón rosa",
  "Flores espatuladas",
  "Lazo borgoña",
  "Maceta con tulipanes",
  "Mi mascota favorita",
  "Mini Blanca Nieves",
  "Osito 3D",
]);

function buildProductImages(folder, productName) {
  const imageFolder = `${THEMATIC_BASE_PATH}/${folder}`;

  if (!foldersWithImages.has(folder)) {
    return fallbackImages.map((image, index) => ({
      ...image,
      alt:
        index === 0
          ? `${productName} de Bake Me Happy`
          : `Imagen referencial de ${productName}`,
    }));
  }

  return [1, 2, 3].map((imageNumber) => ({
    src: `${imageFolder}/${imageNumber}.webp`,
    alt:
      imageNumber === 1
        ? `${productName} de Bake Me Happy`
        : `Vista ${imageNumber} de ${productName}`,
    position: "center",
  }));
}

function createThematicProduct({
  id,
  name,
  folder,
  description,
  occasions,
  prices,
}) {
  const images = buildProductImages(folder, name);

  return {
    id,
    name,
    description,
    category: "Tortas tematicas",
    occasions,
    tags: ["Torta tematica", "Buttercream"],
    image: images[0].src,
    images,
    imageFolder: `${THEMATIC_BASE_PATH}/${folder}`,
    hasProductImages: foldersWithImages.has(folder),
    imagePosition: images[0].position,
    servings: prices.map((price) => price.split(":")[0]).join(", "),
    details: description,
    preparationTime: "24 horas",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    prices,
  };
}

export const thematicProducts = [
  createThematicProduct({
    id: 101,
    name: "Corazón Rosa",
    folder: "Corazón rosa",
    description:
      "Torta en forma de corazón decorada con buttercream y lazos de tela.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 110",
      "20 porciones: S/ 200",
      "30 porciones: S/ 250",
    ],
  }),
  createThematicProduct({
    id: 102,
    name: "Maceta con Tulipanes",
    folder: "Maceta con tulipanes",
    description:
      "Torta decorada con buttercream y detalles de masa elástica.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 130",
      "15 porciones: S/ 160",
      "20 porciones: S/ 200",
      "30 porciones: S/ 250",
    ],
  }),
  createThematicProduct({
    id: 103,
    name: "Corazón con Frambuesas",
    folder: "Corazón con frambuesas",
    description: "Torta decorada con buttercream y frambuesas frescas.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 100",
      "20 porciones: S/ 220",
      "30 porciones: S/ 260",
    ],
  }),
  createThematicProduct({
    id: 104,
    name: "Osito 3D",
    folder: "Osito 3D",
    description:
      "Torta tallada en forma de oso, decorada con buttercream y detalles de masa elástica.",
    occasions: ["BABY", "NIÑOS Y NIÑAS"],
    prices: ["15 porciones: S/ 160", "30 porciones: S/ 320"],
  }),
  createThematicProduct({
    id: 105,
    name: "Mini Blancanieves",
    folder: "Mini Blanca Nieves",
    description:
      "Torta decorada con buttercream, detalles de masa elástica y manzana fresca.",
    occasions: ["PARA ELLA", "NIÑOS Y NIÑAS"],
    prices: [
      "Tiny cake: S/ 120",
      "15 porciones: S/ 160",
      "20 porciones: S/ 200",
      "30 porciones: S/ 250",
    ],
  }),
  createThematicProduct({
    id: 106,
    name: "Flores Espatuladas",
    folder: "Flores espatuladas",
    description:
      "Torta decorada con buttercream y flores espatuladas elaboradas con buttercream.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 100",
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 107,
    name: "Camino de Mariposas",
    folder: "Camino de mariposas",
    description:
      "Torta decorada con buttercream y mariposas de papel comestible.",
    occasions: ["PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    prices: [
      "Tiny cake: S/ 100",
      "15 porciones: S/ 120",
      "20 porciones: S/ 160",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 108,
    name: "Mi Mascota Favorita",
    folder: "Mi mascota favorita",
    description:
      "Torta decorada con buttercream y detalles de masa elástica.",
    occasions: ["PARA EL", "PARA ELLA", "NIÑOS Y NIÑAS"],
    prices: [
      "Tiny cake: S/ 120",
      "15 porciones: S/ 150",
      "20 porciones: S/ 170",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 109,
    name: "Lazo Borgoña",
    folder: "Lazo borgoña",
    description:
      "Torta decorada con buttercream, perlas comestibles y un lazo elaborado con masa elástica.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 170",
      "20 porciones: S/ 230",
      "30 porciones: S/ 260",
    ],
  }),
  createThematicProduct({
    id: 110,
    name: "Camino de Mariposas 2",
    folder: "Camino de mariposas 2",
    description:
      "Torta decorada con buttercream, perlas comestibles y mariposas de papel comestible.",
    occasions: ["PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    prices: [
      "Tiny cake: S/ 80",
      "15 porciones: S/ 100",
      "20 porciones: S/ 150",
      "30 porciones: S/ 200",
    ],
  }),
  createThematicProduct({
    id: 111,
    name: "Flores Espatuladas 2",
    folder: "Flores espatuladas 2",
    description: "Torta decorada con buttercream y perlas comestibles.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 100",
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 112,
    name: "Spider-Man",
    folder: "Spiderman",
    description:
      "Torta decorada con buttercream, perlas comestibles y detalles de scrapbook.",
    occasions: ["PARA EL", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 180",
      "20 porciones: S/ 240",
      "30 porciones: S/ 280",
    ],
  }),
  createThematicProduct({
    id: 113,
    name: "Rosa Natural",
    folder: "Rosa natural",
    description:
      'Torta decorada con buttercream, flores naturales y topper de "Happy Birthday".',
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 200",
      "20 porciones: S/ 250",
      "30 porciones: S/ 290",
    ],
  }),
  createThematicProduct({
    id: 114,
    name: "Osito Marrón",
    folder: "Osito marrón",
    description:
      "Torta decorada con buttercream y detalles de masa elástica.",
    occasions: ["BABY", "NIÑOS Y NIÑAS"],
    prices: [
      "Tiny cake: S/ 120",
      "15 porciones: S/ 150",
      "20 porciones: S/ 180",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 115,
    name: "Vintage Love",
    folder: "Vintage love",
    description:
      "Torta decorada con buttercream, detalles elaborados con manga pastelera y número personalizable.",
    occasions: ["PARA EL", "PARA ELLA"],
    prices: [
      "Tiny cake: S/ 90",
      "15 porciones: S/ 110",
      "20 porciones: S/ 160",
      "30 porciones: S/ 200",
    ],
  }),
  createThematicProduct({
    id: 116,
    name: "Rosa Drip",
    folder: "Rosa drip",
    description:
      "Torta decorada con buttercream, drip de ganache de chocolate y barritas de chocolate.",
    occasions: ["PARA ELLA"],
    prices: [
      "15 porciones: S/ 100",
      "20 porciones: S/ 150",
      "30 porciones: S/ 250",
    ],
  }),
  createThematicProduct({
    id: 117,
    name: "Pequeño Conductor",
    folder: "Pequeño conductor",
    description:
      "Torta cubierta y decorada con masa elástica, con detalles modelados en fondant.",
    occasions: ["PARA EL", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 280",
      "20 porciones: S/ 320",
      "30 porciones: S/ 350",
    ],
  }),
  createThematicProduct({
    id: 118,
    name: "Floral Deluxe",
    folder: "Floral deluxe",
    description:
      "Torta decorada con buttercream, flores elaboradas con buttercream y detalles de masa elástica.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 200",
      "20 porciones: S/ 250",
      "30 porciones: S/ 300",
    ],
  }),
  createThematicProduct({
    id: 119,
    name: "Pretty Kitty",
    folder: "Pretty Kity",
    description:
      "Torta decorada con buttercream y detalles de scrapbook.",
    occasions: ["PARA ELLA", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 150",
      "20 porciones: S/ 180",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 120,
    name: "Minimal Grey",
    folder: "Minimal grey",
    description:
      "Torta decorada con buttercream y detalles espatulados elaborados con buttercream.",
    occasions: ["PARA EL", "PARA ELLA", "GRADUACION"],
    prices: [
      "Tiny cake: S/ 80",
      "15 porciones: S/ 100",
      "20 porciones: S/ 150",
      "30 porciones: S/ 200",
    ],
  }),
  createThematicProduct({
    id: 121,
    name: "Minimal Blue",
    folder: "Minimal blue",
    description:
      "Torta decorada con buttercream y detalles espatulados elaborados con buttercream.",
    occasions: ["PARA EL", "BABY"],
    prices: [
      "Tiny cake: S/ 80",
      "15 porciones: S/ 100",
      "20 porciones: S/ 150",
      "30 porciones: S/ 200",
    ],
  }),
  createThematicProduct({
    id: 122,
    name: "Caballeros del Zodiaco",
    folder: "Caballeros del zodiaco",
    description:
      "Torta decorada con buttercream y detalles de scrapbook.",
    occasions: ["PARA EL", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 150",
      "20 porciones: S/ 180",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 123,
    name: "Flores Espatuladas 3",
    folder: "Flores espatuladas 3",
    description: "Torta decorada con buttercream y perlas comestibles.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 100",
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 124,
    name: "Vintage Raspberries",
    folder: "Vintage raspberries",
    description:
      "Torta decorada con buttercream, lazos de tela y frambuesas frescas en la parte superior.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 200",
      "20 porciones: S/ 250",
      "30 porciones: S/ 300",
    ],
  }),
  createThematicProduct({
    id: 125,
    name: "Flores Espatuladas para Compartir",
    folder: "Flores espatuladas para compartir",
    description:
      "Torta decorada con buttercream y flores espatuladas elaboradas con buttercream.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 120",
      "15 porciones: S/ 150",
      "20 porciones: S/ 200",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 126,
    name: "Botanical Garden",
    folder: "Botanical garden",
    description:
      "Torta decorada con buttercream y detalles de flores naturales.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 150",
      "20 porciones: S/ 180",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 127,
    name: "Tiny Friends",
    folder: "Tiny friends",
    description:
      "Torta decorada con buttercream, detalles de masa elástica y muñequitas modeladas en fondant.",
    occasions: ["PARA ELLA", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 280",
      "20 porciones: S/ 330",
      "30 porciones: S/ 380",
    ],
  }),
  createThematicProduct({
    id: 128,
    name: "Black and White",
    folder: "Black and white",
    description: "Torta decorada con buttercream y lazos de tela.",
    occasions: ["PARA EL", "PARA ELLA", "BODAS"],
    prices: [
      "Tiny cake: S/ 120",
      "15 porciones: S/ 150",
      "20 porciones: S/ 180",
      "30 porciones: S/ 210",
    ],
  }),
  createThematicProduct({
    id: 129,
    name: "Castillo de Bowser",
    folder: "Castillo de Bowser",
    description:
      "Torta decorada con buttercream y detalles de masa elástica.",
    occasions: ["PARA EL", "NIÑOS Y NIÑAS"],
    prices: [
      "15 porciones: S/ 150",
      "20 porciones: S/ 200",
      "30 porciones: S/ 220",
    ],
  }),
  createThematicProduct({
    id: 130,
    name: "Corazón Vintage",
    folder: "Corazon vintage",
    description:
      "Torta en forma de corazón decorada con buttercream, escarcha comestible y frase personalizada en scrapbook.",
    occasions: ["PARA EL", "PARA ELLA"],
    prices: [
      "Tiny cake: S/ 150",
      "20 porciones: S/ 200",
      "30 porciones: S/ 280",
    ],
  }),
  createThematicProduct({
    id: 131,
    name: "Jardín Vintage",
    folder: "Jardin Vintage",
    description:
      "Torta decorada con buttercream y flores elaboradas con buttercream.",
    occasions: ["PARA ELLA", "BODAS"],
    prices: [
      "15 porciones: S/ 190",
      "20 porciones: S/ 250",
      "30 porciones: S/ 290",
    ],
  }),
  createThematicProduct({
    id: 132,
    name: "Mini Romance",
    folder: "Mini romance",
    description:
      "Mini torta decorada con buttercream y corazones elaborados con buttercream.",
    occasions: ["PARA EL", "PARA ELLA"],
    prices: ["Mini torta de 10 cm de diámetro: S/ 30"],
  }),
];
