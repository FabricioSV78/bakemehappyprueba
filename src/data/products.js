const heroImages = [
  {
    src: "/images/webp/hero 1.webp",
    alt: "Torta personalizada de Bake Me Happy",
    position: "center",
  },
  {
    src: "/images/webp/hero 2.webp",
    alt: "Torta decorada de Bake Me Happy",
    position: "center",
  },
  {
    src: "/images/webp/hero 3.webp",
    alt: "Celebracion con torta de Bake Me Happy",
    position: "center",
  },
];

const productImage = heroImages[0].src;

function numberedCakeImages(folderPath, productName) {
  return [1, 2, 3].map((imageNumber) => ({
    src: `${folderPath}/${imageNumber}.webp`,
    alt:
      imageNumber === 1
        ? `${productName} de Bake Me Happy`
        : `Vista ${imageNumber} de ${productName}`,
    position: "center",
  }));
}

function namedCakeImages(folderPath, filePrefix, productName) {
  return [1, 2, 3].map((imageNumber) => ({
    src: `${folderPath}/${filePrefix}${imageNumber}.webp`,
    alt:
      imageNumber === 1
        ? `${productName} de Bake Me Happy`
        : `Vista ${imageNumber} de ${productName}`,
    position: "center",
  }));
}

const personalizedBasePath = "/images/webp/TORTAS/tortas personalizadas";
const classicBasePath = "/images/webp/TORTAS/tortas clasicas";

const butterflyImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 1`,
  "Butterfly Cake",
);
const teddyImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 2`,
  "Teddy Cake",
);
const momImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 3`,
  "Torta Dia de Mama",
);
const rosetteImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 4`,
  "Rosette Cake",
);
const twoTierImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 5`,
  "Two Tier Cake",
);
const heartImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 6`,
  "Heart Cake",
);
const valentineImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 7`,
  "Valentine Berries Cake",
);
const appleImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 8`,
  "Apple Cake",
);
const floralMomImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 9`,
  "Floral Mama Cake",
);
const christmasTeddyImages = numberedCakeImages(
  `${personalizedBasePath}/personalizada 10`,
  "Christmas Teddy Cake",
);
const chocomanjarImages = namedCakeImages(
  `${classicBasePath}/torta chocomanjar`,
  "T-Chocomanjar",
  "Torta de Chocomanjar",
);
const redVelvetImages = numberedCakeImages(
  `${classicBasePath}/torta red velvet`,
  "Torta Red Velvet",
);
const fullChocolateImages = numberedCakeImages(
  `${classicBasePath}/torta full chocolate`,
  "Torta Full Chocolate",
);

export const products = [
  {
    id: 1,
    name: "Butterfly Cake",
    description: "Decorada con buttercream, perlas y mariposas comestibles.",
    category: "Tortas tematicas",
    occasions: ["PARA ELLA", "BODAS", "BABY", "NIÑOS Y NIÑAS"],
    tags: ["Mariposas", "Buttercream", "Cumpleanos"],
    image: butterflyImages[0].src,
    images: butterflyImages,
    imagePosition: butterflyImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Torta de acabado delicado con mariposas, perlas y flores suaves. Ideal para cumpleanos elegantes, celebraciones familiares y mesas dulces en tonos pastel.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Decoracion en buttercream",
      "Topper segun diseno",
      "Paleta de color personalizada",
    ],
    prices: [
      "15 porciones: S/ 100",
      "20 porciones: S/ 150",
      "30 porciones: S/ 200",
    ],
  },
  {
    id: 2,
    name: "Teddy Cake",
    description:
      "Decorada con buttercream y detalles modelados en masa elastica.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    tags: ["Infantil", "Modelado", "Buttercream"],
    image: teddyImages[0].src,
    images: teddyImages,
    imagePosition: teddyImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Diseno tierno para cumpleanos infantiles o baby shower. Se puede personalizar con colores, nombre, edad y pequenos detalles modelados.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Detalles en masa elastica",
      "Nombre o edad",
      "Diseno coordinado por referencia",
    ],
    prices: [
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 210",
    ],
  },
  {
    id: 3,
    name: "Torta Dia de Mama",
    description:
      "Flores delicadas, topper personalizado y un acabado hecho para celebrar.",
    category: "Tortas tematicas",
    occasions: ["PARA ELLA"],
    tags: ["Mama", "Flores", "Topper"],
    image: momImages[0].src,
    images: momImages,
    imagePosition: momImages[0].position,
    servings: "Desde 15 porciones",
    details:
      "Torta floral con mensaje o topper personalizado. Funciona muy bien para Dia de la Madre, cumpleanos de mama o celebraciones familiares.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Topper personalizado",
      "Flores decorativas",
      "Acabado en buttercream",
    ],
    price: "Desde S/ 120",
  },
  {
    id: 4,
    name: "Rosette Cake",
    description:
      "Cobertura de rosas en buttercream con tonos suaves y acabado romantico.",
    category: "Tortas tematicas",
    occasions: ["PARA ELLA", "BODAS"],
    tags: ["Rosas", "Romantica", "Buttercream"],
    image: rosetteImages[0].src,
    images: rosetteImages,
    imagePosition: rosetteImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Diseno con rosetas de buttercream, perfecto para cumpleanos, aniversarios o detalles especiales. Puede trabajarse en rosa, lavanda, blanco o tonos combinados.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Rosetas en buttercream", "Color personalizado", "Mensaje corto"],
    prices: [
      "15 porciones: S/ 115",
      "20 porciones: S/ 160",
      "30 porciones: S/ 205",
    ],
  },
  {
    id: 5,
    name: "Two Tier Cake",
    description:
      "Torta de dos pisos para celebraciones grandes y disenos mas protagonistas.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA", "BODAS", "GRADUACION"],
    tags: ["2 pisos", "Eventos", "Premium"],
    image: twoTierImages[0].src,
    images: twoTierImages,
    imagePosition: twoTierImages[0].position,
    servings: "25 a 65 porciones",
    details:
      "Formato de dos pisos recomendado para fiestas con mayor cantidad de invitados. Permite combinar colores, texturas, flores, toppers y detalles tematicos.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Diseno de dos pisos",
      "Estructura interna",
      "Coordinacion de traslado",
    ],
    prices: ["Small: consultar", "Medium: consultar", "Large: consultar"],
  },
  {
    id: 6,
    name: "Heart Cake",
    description:
      "Torta en forma de corazon con borde decorado y mensaje personalizado.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Corazon", "Mensaje", "Regalo"],
    image: heartImages[0].src,
    images: heartImages,
    imagePosition: heartImages[0].position,
    servings: "20 a 30 porciones",
    details:
      "Una opcion dulce y expresiva para aniversarios, cumpleanos, pedidas o regalos personalizados. Se adapta con color, frase y decoracion.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Molde corazon", "Mensaje personalizado", "Borde decorado"],
    prices: ["20 porciones: consultar", "30 porciones: consultar"],
  },
  {
    id: 16,
    name: "Valentine Berries Cake",
    description:
      "Torta corazon con buttercream, berries y topper personalizado.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Corazon", "Berries", "Regalo"],
    image: valentineImages[0].src,
    images: valentineImages,
    imagePosition: valentineImages[0].position,
    servings: "20 a 30 porciones",
    details:
      "Diseno en forma de corazon con borde de buttercream, frutos rojos y topper para fechas especiales. Ideal para San Valentin, aniversarios o regalos personalizados.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Molde corazon", "Berries decorativos", "Topper personalizado"],
    prices: ["20 porciones: consultar", "30 porciones: consultar"],
  },
  {
    id: 17,
    name: "Apple Cake",
    description:
      "Decoracion tematica con manzana modelada, lazo y acabado elegante.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA", "GRADUACION", "NIÑOS Y NIÑAS"],
    tags: ["Tematica", "Modelado", "Buttercream"],
    image: appleImages[0].src,
    images: appleImages,
    imagePosition: appleImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Torta tematica con pieza modelada, lazo decorativo y paleta de color coordinada. Se adapta para cumpleanos, celebraciones infantiles o pedidos con referencia visual.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Figura modelada",
      "Color personalizado",
      "Diseno coordinado por referencia",
    ],
    prices: [
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 210",
    ],
  },
  {
    id: 18,
    name: "Floral Mama Cake",
    description:
      "Torta floral con rosetas de buttercream y topper para mama.",
    category: "Tortas tematicas",
    occasions: ["PARA ELLA", "BODAS"],
    tags: ["Mama", "Flores", "Buttercream"],
    image: floralMomImages[0].src,
    images: floralMomImages,
    imagePosition: floralMomImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Diseno floral con tonos calidos, rosetas de buttercream y topper personalizado. Perfecta para Dia de la Madre, cumpleanos de mama o celebraciones familiares.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Flores en buttercream", "Topper personalizado", "Mensaje corto"],
    prices: [
      "15 porciones: S/ 115",
      "20 porciones: S/ 160",
      "30 porciones: S/ 205",
    ],
  },
  {
    id: 19,
    name: "Christmas Teddy Cake",
    description:
      "Diseno navideno con oso modelado, arbol y detalles festivos.",
    category: "Tortas tematicas",
    occasions: ["PARA EL", "PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    tags: ["Navidad", "Modelado", "Eventos"],
    image: christmasTeddyImages[0].src,
    images: christmasTeddyImages,
    imagePosition: christmasTeddyImages[0].position,
    servings: "15 a 30 porciones",
    details:
      "Torta navidena con oso modelado, arbol, regalos y lazo decorativo. Recomendada para reuniones familiares, cenas de temporada y celebraciones corporativas pequenas.",
    flavors: ["Vainilla con chispas", "Chocolate humedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Detalles modelados",
      "Paleta navidena",
      "Diseno coordinado por referencia",
    ],
    prices: [
      "15 porciones: S/ 130",
      "20 porciones: S/ 180",
      "30 porciones: S/ 230",
    ],
  },
  {
    id: 7,
    name: "Torta de Chocomanjar",
    description:
      "Bizcocho de chocolate relleno con manjar de olla y decorado con fudge de olla.",
    category: "Tortas clasicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Clasica", "Chocolate", "Hecha con amor"],
    image: chocomanjarImages[0].src,
    images: chocomanjarImages,
    imagePosition: chocomanjarImages[0].position,
    servings: "22 cm y 28 cm",
    details:
      "Delicioso bizcocho de chocolate relleno con manjar de olla y decorada con fudge de olla. Una opcion clasica para quienes buscan sabor intenso y acabado artesanal.",
    flavors: ["Bizcocho de chocolate"],
    fillings: ["Manjar de olla", "Fudge de olla"],
    includes: [
      "Decoracion clasica",
      "Acabado con fudge",
      "Ingredientes de primera calidad",
    ],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 8,
    name: "Torta Red Velvet",
    description:
      "Bizcocho rojo aterciopelado relleno con manjar de olla y decorado con frosting de queso crema.",
    category: "Tortas clasicas",
    occasions: ["PARA ELLA", "BODAS"],
    tags: ["Clasica", "Red Velvet", "Frosting"],
    image: redVelvetImages[0].src,
    images: redVelvetImages,
    imagePosition: redVelvetImages[0].position,
    servings: "22 cm y 28 cm",
    details:
      "Suave bizcocho rojo aterciopelado relleno con manjar de olla y decorado con frosting de queso crema. Equilibra dulzor, color y textura en una presentacion elegante.",
    flavors: ["Red velvet"],
    fillings: ["Manjar de olla", "Frosting de queso crema"],
    includes: [
      "Acabado clasico",
      "Frosting de queso crema",
      "Elaboracion artesanal",
    ],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 9,
    name: "Torta Full Chocolate",
    description:
      "Bizcocho de chocolate relleno y decorado con fudge de olla para amantes del cacao.",
    category: "Tortas clasicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Clasica", "Chocolate", "Fudge"],
    image: fullChocolateImages[0].src,
    images: fullChocolateImages,
    imagePosition: fullChocolateImages[0].position,
    servings: "22 cm y 28 cm",
    details:
      "Para los verdaderos amantes del chocolate. Bizcocho de chocolate relleno y decorado con fudge de olla, con un sabor profundo y tradicional.",
    flavors: ["Bizcocho de chocolate"],
    fillings: ["Fudge de olla"],
    includes: ["Cobertura de fudge", "Receta tradicional", "Sabor intenso"],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 10,
    name: "Torta de Zanahoria",
    description:
      "Bizcocho humedo de zanahoria con pecanas y acabado artesanal.",
    category: "Tortas clasicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Clasica", "Zanahoria", "Pecanas"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "22 cm y 28 cm",
    details:
      "Torta casera de zanahoria con pecanas, de miga humeda y sabor especiado suave. Ideal para quienes prefieren una opcion clasica distinta al chocolate.",
    flavors: ["Zanahoria con pecanas"],
    fillings: ["Frosting de queso crema"],
    includes: [
      "Receta tradicional",
      "Masa humeda",
      "Ingredientes seleccionados",
    ],
    prices: ["22 cm: S/ 100", "28 cm: S/ 190"],
  },
  {
    id: 11,
    name: "Torta Tres Leches Vainilla",
    description:
      "Bizcocho de vainilla humedecido al estilo tres leches con sabor suave y casero.",
    category: "Tortas clasicas",
    occasions: ["PARA EL", "PARA ELLA"],
    tags: ["Clasica", "Vainilla", "Tres leches"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "22 cm y 28 cm",
    details:
      "Una version clasica y suave para compartir en familia. Su bizcocho de vainilla humedecido ofrece una textura ligera y muy agradable al paladar.",
    flavors: ["Vainilla"],
    fillings: ["Tres leches"],
    includes: ["Textura suave", "Sabor tradicional", "Elaboracion artesanal"],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 12,
    name: "Torta Damero",
    description:
      "Torta clasica con combinacion visual de vainilla y chocolate en capas tipo damero.",
    category: "Tortas clasicas",
    occasions: ["PARA EL", "PARA ELLA", "NIÑOS Y NIÑAS"],
    tags: ["Clasica", "Damero", "Vainilla y chocolate"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "22 cm y 28 cm",
    details:
      "Una torta de presentacion llamativa y sabor clasico, combinando vainilla y chocolate en un formato tradicional que encanta por dentro y por fuera.",
    flavors: ["Queque marmoleado de chocolate y vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Acabado clasico",
      "Combinacion de sabores",
      "Perfecta para compartir",
    ],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 13,
    name: "Tiny cake redonda",
    description:
      "Version redonda de tiny cake, ideal para regalar o compartir en un momento especial.",
    category: "Mini tortas",
    tags: ["Tiny cake", "Redonda", "Buttercream"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "6 a 7 porciones",
    dimensions: "14 cm x 7 cm",
    details:
      "Tiny cake en formato redondo de 14 cm, pensada para celebraciones pequenas o regalos dulces. Se trabaja con receta definida, acabado en buttercream y modelos coordinados segun disponibilidad.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Decorada con buttercream",
      "Formato regalo",
      "Modelos coordinados segun disponibilidad",
    ],
    price: "S/ 30 c/u",
  },
  {
    id: 14,
    name: "Mini torta individual",
    description:
      "Queque de vainilla relleno de manjar de olla y decorado con buttercream.",
    category: "Mini tortas",
    tags: ["Mini torta", "Individual", "Buttercream"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "1 a 2 porciones",
    details:
      "Mini torta individual presentada en cajita, ideal para un regalo dulce o una sorpresa especial. Se prepara con queque de vainilla, relleno de manjar de olla y acabado en buttercream. Los modelos disponibles son limitados y se coordinan segun stock.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Decorada con buttercream",
      "Empaque individual tipo cajita",
      "Unicos modelos disponibles",
    ],
    price: "S/ 30 c/u",
  },
  {
    id: 15,
    name: "Tiny cake corazon",
    description:
      "Version corazon de tiny cake, perfecta para regalos dulces y detalles con un toque especial.",
    category: "Mini tortas",
    tags: ["Tiny cake", "Corazon", "Buttercream"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "6 a 7 porciones",
    dimensions: "14 cm x 7 cm",
    details:
      "Tiny cake en forma de corazon de 14 cm, ideal para sorprender con una presentacion tierna y especial. Se prepara con receta fija, acabado en buttercream y modelos coordinados segun disponibilidad.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Forma corazon",
      "Decorada con buttercream",
      "Modelos coordinados segun disponibilidad",
    ],
    price: "S/ 30 c/u",
  },
  {
    id: 20,
    name: "Cup Cakes Tematicos",
    description:
      "Cup cakes decorados para mesas dulces, box sorpresa y celebraciones tematicas.",
    category: "Bocaditos tematicos",
    occasions: ["BODAS", "BABY", "GRADUACION", "NIÑOS Y NIÑAS"],
    tags: ["Cup cakes", "Tematica", "Eventos"],
    image: heroImages[1].src,
    images: heroImages,
    imagePosition: "center",
    servings: "Pack de 6, 12 o 24 unidades",
    details:
      "Cup cakes personalizados con buttercream y decoracion coordinada segun tu tematica, paleta de color o tipo de celebracion.",
    flavors: ["Vainilla", "Chocolate", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Decoracion tematica",
      "Color coordinado",
      "Presentacion lista para entregar",
    ],
    prices: [
      "Pack de 6: S/ 45",
      "Pack de 12: S/ 85",
      "Pack de 24: S/ 160",
    ],
  },
  {
    id: 21,
    name: "Choco Paletas Tematicas",
    description:
      "Paletas de chocolate decoradas para recuerdos, regalos y mesas dulces.",
    category: "Bocaditos tematicos",
    occasions: ["BABY", "GRADUACION", "NIÑOS Y NIÑAS"],
    tags: ["Choco paletas", "Chocolate", "Tematica"],
    image: heroImages[2].src,
    images: heroImages,
    imagePosition: "center",
    servings: "Pack de 6, 12 o 24 unidades",
    details:
      "Choco paletas con decoracion personalizada, ideales para complementar tortas, cajitas sorpresa o detalles de celebracion.",
    flavors: ["Chocolate blanco", "Chocolate de leche", "Chocolate mixto"],
    includes: [
      "Decoracion tematica",
      "Cobertura personalizada",
      "Empaque coordinado",
    ],
    prices: [
      "Pack de 6: S/ 30",
      "Pack de 12: S/ 55",
      "Pack de 24: S/ 100",
    ],
  },
  {
    id: 22,
    name: "Kpops Tematicos",
    description:
      "Kpops decorados para cumpleanos, regalos y celebraciones con estilo.",
    category: "Bocaditos tematicos",
    occasions: ["BABY", "GRADUACION", "NIÑOS Y NIÑAS"],
    tags: ["Kpops", "Tematica", "Mesa dulce"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "Pack de 6, 12 o 24 unidades",
    details:
      "Bocaditos tematicos listos para mesas dulces o packs de regalo, trabajados con colores y detalles coordinados segun referencia.",
    flavors: ["Vainilla", "Chocolate"],
    fillings: ["Cobertura de chocolate"],
    includes: [
      "Decoracion tematica",
      "Presentacion coordinada",
      "Acabado artesanal",
    ],
    prices: [
      "Pack de 6: S/ 36",
      "Pack de 12: S/ 68",
      "Pack de 24: S/ 128",
    ],
  },
  {
    id: 23,
    name: "Vela de Signo de Interrogacion",
    description:
      "Vela decorativa para revelar sorpresa o sumar un detalle divertido al pastel.",
    category: "Complementos",
    occasions: ["PARA EL", "PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    tags: ["Vela", "Complemento", "Cumpleanos"],
    image: heroImages[1].src,
    images: heroImages,
    imagePosition: "center",
    servings: "1 unidad",
    details:
      "Complemento ideal para tortas de cumpleanos o revelaciones. Se coordina segun disponibilidad y combinacion de colores.",
    includes: ["Lista para colocar", "Coordinacion por color", "Detalle decorativo"],
    price: "S/ 8",
  },
  {
    id: 24,
    name: "Velas Espiral",
    description:
      "Juego de velas espiral para darle un acabado mas festivo a la torta.",
    category: "Complementos",
    occasions: ["PARA EL", "PARA ELLA", "BABY", "NIÑOS Y NIÑAS"],
    tags: ["Velas", "Complemento", "Fiesta"],
    image: heroImages[2].src,
    images: heroImages,
    imagePosition: "center",
    servings: "Set de 6 unidades",
    details:
      "Velas decorativas de estilo espiral para complementar tortas clasicas o tematicas con un acabado alegre.",
    includes: ["Set decorativo", "Facil de colocar", "Detalle final para celebracion"],
    price: "S/ 6",
  },
  {
    id: 25,
    name: "Topper Happy Birthday",
    description:
      "Topper decorativo para completar la presentacion del pedido.",
    category: "Complementos",
    occasions: ["PARA EL", "PARA ELLA", "BODAS", "BABY", "GRADUACION", "NIÑOS Y NIÑAS"],
    tags: ["Topper", "Complemento", "Happy Birthday"],
    image: productImage,
    images: heroImages,
    imagePosition: "center",
    servings: "1 unidad",
    details:
      "Topper clasico de Happy Birthday para sumar un detalle visual rapido y elegante a la decoracion final.",
    includes: ["Listo para usar", "Detalle decorativo", "Compatible con varias tortas"],
    price: "S/ 15",
  },
];

export const categories = [
  "Tortas clasicas",
  "Tortas tematicas",
  "Bocaditos tematicos",
  "Complementos",
];

export const occasionOptions = [
  "PARA EL",
  "PARA ELLA",
  "BODAS",
  "BABY",
  "GRADUACION",
  "NIÑOS Y NIÑAS",
];

export const cakeFlavors = [
  {
    label: "Vainilla con chispas de chocolate",
    helper: "Sabor base",
    surcharge: 0,
  },
  {
    label: "Chocolate humedo",
    helper: "Sabor base",
    surcharge: 0,
  },
  {
    label: "Red velvet",
    helper: "Sabor base",
    surcharge: 0,
  },
  {
    label: "Zanahoria con pecanas",
    helper: "Sabor especial",
    surcharge: 20,
  },
  {
    label: "Marmoleado de chocolate y vainilla",
    helper: "Sabor especial",
    surcharge: 20,
  },
  {
    label: "Naranja wando",
    helper: "Sabor especial",
    surcharge: 20,
  },
];

export const fillingFlavors = [
  {
    label: "Manjar de olla",
    helper: "Relleno base",
    surcharge: 0,
  },
  {
    label: "Fudge de olla",
    helper: "Relleno base",
    surcharge: 0,
  },
  {
    label: "Frosting de queso crema",
    helper: "Relleno base",
    surcharge: 0,
  },
  {
    label: "Mermelada de arandanos y fresas",
    helper: "Relleno especial",
    surcharge: 15,
  },
];

export const sizeGuide = {
  twoTiers: [
    {
      name: "Small",
      portions: "25 - 30 porciones",
      dimensions: "Piso superior 14 cm / base 18 cm / alto 14 + 14 cm",
    },
    {
      name: "Medium",
      portions: "40 - 45 porciones",
      dimensions: "Piso superior 18 cm / base 22 cm / alto 14 + 14 cm",
    },
    {
      name: "Large",
      portions: "60 - 65 porciones",
      dimensions: "Piso superior 18 cm / base 26 cm / alto 14 + 14 cm",
    },
  ],
  oneTier: [
    {
      name: "Small",
      portions: "15 porciones",
      dimensions: "18 cm de diametro / 14 cm de alto",
    },
    {
      name: "Medium",
      portions: "20 porciones",
      dimensions: "22 cm de diametro / 15 cm de alto",
    },
    {
      name: "Large",
      portions: "30 porciones",
      dimensions: "22 cm de diametro / 18 cm de alto",
    },
  ],
  special: [
    {
      name: "Tiny cake",
      portions: "6 a 7 porciones",
      dimensions: "14 cm de diametro / 7 cm de alto",
    },
    {
      name: "Mini torta",
      portions: "1 a 2 porciones",
      dimensions: "Formato individual decorado",
    },
    {
      name: "Corazon 20",
      portions: "20 porciones",
      dimensions: "17 cm de ancho / 12 cm de alto",
    },
    {
      name: "Corazon 30",
      portions: "30 porciones",
      dimensions: "23 cm de ancho / 12 cm de alto",
    },
  ],
};
