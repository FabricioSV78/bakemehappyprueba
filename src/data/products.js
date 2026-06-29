const productImage = "/images/webp/bake-me-happy-hero.webp";
const chocomanjarImages = [
  {
    src: "/images/webp/torta chocomanjar/T-Chocomanjar1.webp",
    alt: "Torta de Chocomanjar de Bake Me Happy",
    position: "center",
  },
  {
    src: "/images/webp/torta chocomanjar/T-Chocomanjar2.webp",
    alt: "Vista alternativa de la Torta de Chocomanjar",
    position: "center",
  },
  {
    src: "/images/webp/torta chocomanjar/T-Chocomanjar3.webp",
    alt: "Detalle de la Torta de Chocomanjar",
    position: "center",
  },
];

// Las imagenes iniciales usan distintos recortes de la foto principal.
// Reemplaza cada image por la foto real del producto cuando este disponible.
export const products = [
  {
    id: 1,
    name: "Butterfly Cake",
    description: "Decorada con buttercream, perlas y mariposas comestibles.",
    category: "Tortas personalizadas",
    tags: ["Mariposas", "Buttercream", "Cumpleaños"],
    image: productImage,
    imagePosition: "72% 36%",
    servings: "15 a 30 porciones",
    details:
      "Torta de acabado delicado con mariposas, perlas y flores suaves. Ideal para cumpleaños elegantes, celebraciones familiares y mesas dulces en tonos pastel.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Decoración en buttercream",
      "Topper según diseño",
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
      "Decorada con buttercream y detalles modelados en masa elástica.",
    category: "Tortas personalizadas",
    tags: ["Infantil", "Modelado", "Buttercream"],
    image: productImage,
    imagePosition: "83% 46%",
    servings: "15 a 30 porciones",
    details:
      "Diseño tierno para cumpleaños infantiles o baby shower. Se puede personalizar con colores, nombre, edad y pequeños detalles modelados.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Detalles en masa elástica",
      "Nombre o edad",
      "Diseño coordinado por referencia",
    ],
    prices: [
      "15 porciones: S/ 120",
      "20 porciones: S/ 170",
      "30 porciones: S/ 210",
    ],
  },
  {
    id: 3,
    name: "Torta Día de Mamá",
    description:
      "Flores delicadas, topper personalizado y un acabado hecho para celebrar.",
    category: "Tortas personalizadas",
    tags: ["Mamá", "Flores", "Topper"],
    image: productImage,
    imagePosition: "74% 26%",
    servings: "Desde 15 porciones",
    details:
      "Torta floral con mensaje o topper personalizado. Funciona muy bien para Día de la Madre, cumpleaños de mamá o celebraciones familiares.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Topper personalizado", "Flores decorativas", "Acabado en buttercream"],
    price: "Desde S/ 120",
  },
  {
    id: 4,
    name: "Rosette Cake",
    description:
      "Cobertura de rosas en buttercream con tonos suaves y acabado romántico.",
    category: "Tortas personalizadas",
    tags: ["Rosas", "Romántica", "Buttercream"],
    image: productImage,
    imagePosition: "80% 34%",
    servings: "15 a 30 porciones",
    details:
      "Diseño con rosetas de buttercream, perfecto para cumpleaños, aniversarios o detalles especiales. Puede trabajarse en rosa, lavanda, blanco o tonos combinados.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
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
      "Torta de dos pisos para celebraciones grandes y diseños más protagonistas.",
    category: "Tortas personalizadas",
    tags: ["2 pisos", "Eventos", "Premium"],
    image: productImage,
    imagePosition: "70% 42%",
    servings: "25 a 65 porciones",
    details:
      "Formato de dos pisos recomendado para fiestas con mayor cantidad de invitados. Permite combinar colores, texturas, flores, toppers y detalles temáticos.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Diseño de dos pisos", "Estructura interna", "Coordinación de traslado"],
    prices: ["Small: consultar", "Medium: consultar", "Large: consultar"],
  },
  {
    id: 6,
    name: "Heart Cake",
    description:
      "Torta en forma de corazón con borde decorado y mensaje personalizado.",
    category: "Tortas personalizadas",
    tags: ["Corazón", "Mensaje", "Regalo"],
    image: productImage,
    imagePosition: "88% 78%",
    servings: "20 a 30 porciones",
    details:
      "Una opción dulce y expresiva para aniversarios, cumpleaños, pedidas o regalos personalizados. Se adapta con color, frase y decoración.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Molde corazón", "Mensaje personalizado", "Borde decorado"],
    prices: ["20 porciones: consultar", "30 porciones: consultar"],
  },
  {
    id: 7,
    name: "Torta de Chocomanjar",
    description:
      "Bizcocho de chocolate relleno con manjar de olla y decorado con fudge de olla.",
    category: "Tortas clásicas",
    tags: ["Clásica", "Chocolate", "Hecha con amor"],
    image: chocomanjarImages[0].src,
    images: chocomanjarImages,
    imagePosition: chocomanjarImages[0].position,
    servings: "22 cm y 28 cm",
    details:
      "Delicioso bizcocho de chocolate relleno con manjar de olla y decorada con fudge de olla. Una opción clásica para quienes buscan sabor intenso y acabado artesanal.",
    flavors: ["Bizcocho de chocolate"],
    fillings: ["Manjar de olla", "Fudge de olla"],
    includes: [
      "Decoración clásica",
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
    category: "Tortas clásicas",
    tags: ["Clásica", "Red Velvet", "Frosting"],
    image: productImage,
    imagePosition: "78% 44%",
    servings: "22 cm y 28 cm",
    details:
      "Suave bizcocho rojo aterciopelado relleno con manjar de olla y decorado con frosting de queso crema. Equilibra dulzor, color y textura en una presentación elegante.",
    flavors: ["Red velvet"],
    fillings: ["Manjar de olla", "Frosting de queso crema"],
    includes: ["Acabado clásico", "Frosting de queso crema", "Elaboración artesanal"],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 9,
    name: "Torta Full Chocolate",
    description:
      "Bizcocho de chocolate relleno y decorado con fudge de olla para amantes del cacao.",
    category: "Tortas clásicas",
    tags: ["Clásica", "Chocolate", "Fudge"],
    image: productImage,
    imagePosition: "74% 48%",
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
      "Bizcocho húmedo de zanahoria con pecanas y acabado artesanal.",
    category: "Tortas clásicas",
    tags: ["Clásica", "Zanahoria", "Pecanas"],
    image: productImage,
    imagePosition: "68% 40%",
    servings: "22 cm y 28 cm",
    details:
      "Torta casera de zanahoria con pecanas, de miga húmeda y sabor especiado suave. Ideal para quienes prefieren una opción clásica distinta al chocolate.",
    flavors: ["Zanahoria con pecanas"],
    fillings: ["Frosting de queso crema"],
    includes: [
      "Receta tradicional",
      "Masa húmeda",
      "Ingredientes seleccionados",
    ],
    prices: ["22 cm: S/ 100", "28 cm: S/ 190"],
  },
  {
    id: 11,
    name: "Torta Tres Leches Vainilla",
    description:
      "Bizcocho de vainilla humedecido al estilo tres leches con sabor suave y casero.",
    category: "Tortas clásicas",
    tags: ["Clásica", "Vainilla", "Tres leches"],
    image: productImage,
    imagePosition: "76% 36%",
    servings: "22 cm y 28 cm",
    details:
      "Una versión clásica y suave para compartir en familia. Su bizcocho de vainilla humedecido ofrece una textura ligera y muy agradable al paladar.",
    flavors: ["Vainilla"],
    fillings: ["Tres leches"],
    includes: ["Textura suave", "Sabor tradicional", "Elaboración artesanal"],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 12,
    name: "Torta Damero",
    description:
      "Torta clásica con combinación visual de vainilla y chocolate en capas tipo damero.",
    category: "Tortas clásicas",
    tags: ["Clásica", "Damero", "Vainilla y chocolate"],
    image: productImage,
    imagePosition: "72% 38%",
    servings: "22 cm y 28 cm",
    details:
      "Una torta de presentación llamativa y sabor clásico, combinando vainilla y chocolate en un formato tradicional que encanta por dentro y por fuera.",
    flavors: ["Queque marmoleado de chocolate y vainilla"],
    fillings: ["Manjar de olla"],
    includes: ["Acabado clásico", "Combinación de sabores", "Perfecta para compartir"],
    prices: ["22 cm: S/ 80", "28 cm: S/ 150"],
  },
  {
    id: 13,
    name: "Tiny cake redonda",
    description:
      "Versión redonda de tiny cake, ideal para regalar o compartir en un momento especial.",
    category: "Mini tortas",
    tags: ["Tiny cake", "Redonda", "Buttercream"],
    image: productImage,
    imagePosition: "90% 82%",
    servings: "6 a 7 porciones",
    dimensions: "14 cm x 7 cm",
    details:
      "Tiny cake en formato redondo de 14 cm, pensada para celebraciones pequeñas o regalos dulces. Se trabaja con receta definida, acabado en buttercream y modelos coordinados según disponibilidad.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Decorada con buttercream",
      "Formato regalo",
      "Modelos coordinados según disponibilidad",
    ],
    price: "Consultar por WhatsApp",
  },
  {
    id: 14,
    name: "Mini torta individual",
    description:
      "Queque de vainilla relleno de manjar de olla y decorado con buttercream.",
    category: "Mini tortas",
    tags: ["Mini torta", "Individual", "Buttercream"],
    image: productImage,
    imagePosition: "42% 82%",
    servings: "1 a 2 porciones",
    details:
      "Mini torta individual presentada en cajita, ideal para un regalo dulce o una sorpresa especial. Se prepara con queque de vainilla, relleno de manjar de olla y acabado en buttercream. Los modelos disponibles son limitados y se coordinan según stock.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Decorada con buttercream",
      "Empaque individual tipo cajita",
      "Únicos modelos disponibles",
    ],
    price: "S/ 30 c/u",
  },
  {
    id: 15,
    name: "Tiny cake corazón",
    description:
      "Versión corazón de tiny cake, perfecta para regalos dulces y detalles con un toque especial.",
    category: "Mini tortas",
    tags: ["Tiny cake", "Corazón", "Buttercream"],
    image: productImage,
    imagePosition: "88% 82%",
    servings: "6 a 7 porciones",
    dimensions: "14 cm x 7 cm",
    details:
      "Tiny cake en forma de corazón de 14 cm, ideal para sorprender con una presentación tierna y especial. Se prepara con receta fija, acabado en buttercream y modelos coordinados según disponibilidad.",
    flavors: ["Queque de vainilla"],
    fillings: ["Manjar de olla"],
    includes: [
      "Forma corazón",
      "Decorada con buttercream",
      "Modelos coordinados según disponibilidad",
    ],
    price: "Consultar por WhatsApp",
  },
];

export const categories = [
  "Tortas clásicas",
  "Tortas personalizadas",
  "Mini tortas",
];

export const cakeFlavors = [
  {
    label: "Queque de vainilla con chispas de chocolate",
    helper: "Sabor base",
    surcharge: 0,
  },
  {
    label: "Chocolate húmedo",
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
    label: "Queque marmoleado de chocolate y vainilla",
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
    label: "Mermelada de arándanos y fresas",
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
      dimensions: "18 cm de diámetro / 14 cm de alto",
    },
    {
      name: "Medium",
      portions: "20 porciones",
      dimensions: "22 cm de diámetro / 15 cm de alto",
    },
    {
      name: "Large",
      portions: "30 porciones",
      dimensions: "22 cm de diámetro / 18 cm de alto",
    },
  ],
  special: [
    {
      name: "Tiny cake",
      portions: "6 a 7 porciones",
      dimensions: "14 cm de diámetro / 7 cm de alto",
    },
    {
      name: "Mini torta",
      portions: "1 a 2 porciones",
      dimensions: "Formato individual decorado",
    },
    {
      name: "Corazón 20",
      portions: "20 porciones",
      dimensions: "17 cm de ancho / 12 cm de alto",
    },
    {
      name: "Corazón 30",
      portions: "30 porciones",
      dimensions: "23 cm de ancho / 12 cm de alto",
    },
  ],
};
