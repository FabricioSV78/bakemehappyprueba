const productImage = "/images/bake-me-happy-hero.jpg";

// Las imagenes iniciales usan distintos recortes de la foto principal.
// Reemplaza cada image por la foto real del producto cuando este disponible.
export const products = [
  {
    id: 1,
    name: "Butterfly Cake",
    description: "Decorada con buttercream, perlas y mariposas comestibles.",
    category: "Tortas temáticas",
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
    category: "Tortas temáticas",
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
    category: "Tortas temáticas",
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
    category: "Tortas temáticas",
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
    category: "Tortas temáticas",
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
    category: "Tortas temáticas",
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
    name: "Cupcakes personalizados",
    description:
      "Decorados para cumpleaños, fechas especiales o detalles personalizados.",
    category: "Postres clásicos",
    tags: ["Cupcakes", "Mesa dulce", "Personalizados"],
    image: productImage,
    imagePosition: "26% 82%",
    servings: "Por docena",
    details:
      "Cupcakes decorados para complementar tortas, mesas dulces o regalos. Se pueden trabajar por temática, color y ocasión.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo"],
    fillings: ["Frosting de queso crema", "Buttercream"],
    includes: [
      "Decoración temática",
      "Cápsulas coordinadas",
      "Presentación lista para entregar",
    ],
    price: "Consultar por WhatsApp",
  },
  {
    id: 8,
    name: "Mini cakes",
    description:
      "Tortas para 6 a 7 porciones, ideales para regalos o celebraciones íntimas.",
    category: "Postres clásicos",
    tags: ["Mini cake", "Regalo", "6 a 7 porciones"],
    image: productImage,
    imagePosition: "90% 82%",
    servings: "6 a 7 porciones",
    details:
      "Formato pequeño para regalar o celebrar en casa. Puede decorarse con flores, frase, color y detalles simples.",
    flavors: ["Vainilla con chispas", "Chocolate húmedo"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Decoración personalizada", "Mensaje corto", "Empaque coordinado"],
    price: "Consultar por WhatsApp",
  },
  {
    id: 9,
    name: "Mini torta individual",
    description:
      "Queque de vainilla relleno de manjar de olla y decorado con buttercream.",
    category: "Postres clásicos",
    tags: ["Mini torta", "Individual", "Buttercream"],
    image: productImage,
    imagePosition: "42% 82%",
    servings: "1 a 2 porciones",
    details:
      "Pequeña torta individual inspirada en el formato de regalo rápido. Ideal para detalles personalizados, fechas especiales o pedidos corporativos pequeños.",
    flavors: ["Vainilla con chispas"],
    fillings: ["Manjar de olla"],
    includes: ["Decoración disponible", "Empaque individual", "Mensaje breve"],
    price: "S/ 30 c/u",
  },
  {
    id: 10,
    name: "Postres variados",
    description:
      "Opciones dulces para compartir, regalar o acompañar celebraciones.",
    category: "Postres clásicos",
    tags: ["Postres", "Mesa dulce", "Compartir"],
    image: productImage,
    imagePosition: "44% 84%",
    servings: "Según pedido",
    details:
      "Selección de postres para acompañar una torta principal o armar una mesa dulce. La variedad se confirma según disponibilidad.",
    flavors: ["Vainilla", "Chocolate", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: [
      "Presentación coordinada",
      "Opciones por cantidad",
      "Asesoría para mesa dulce",
    ],
    price: "Consultar por WhatsApp",
  },
  {
    id: 11,
    name: "Brownies decorados",
    description:
      "Brownies con decoración simple para regalar o sumar a una mesa dulce.",
    category: "Postres clásicos",
    tags: ["Brownies", "Chocolate", "Mesa dulce"],
    image: productImage,
    imagePosition: "34% 82%",
    servings: "Por caja",
    details:
      "Brownies húmedos con presentación personalizada. Pueden coordinarse como detalle, complemento de torta o caja para compartir.",
    flavors: ["Chocolate húmedo"],
    fillings: ["Fudge de olla"],
    includes: ["Caja de presentación", "Decoración simple", "Cantidad coordinada"],
    price: "Consultar por WhatsApp",
  },
  {
    id: 12,
    name: "Box dulce personalizado",
    description:
      "Caja con mini postres y detalles dulces coordinados por ocasión.",
    category: "Postres clásicos",
    tags: ["Box", "Regalo", "Personalizado"],
    image: productImage,
    imagePosition: "60% 82%",
    servings: "Según box",
    details:
      "Una alternativa para regalar sin pedir una torta grande. Puede combinar mini tortas, cupcakes, brownies u otros detalles según disponibilidad.",
    flavors: ["Vainilla", "Chocolate", "Red velvet"],
    fillings: ["Manjar de olla", "Fudge de olla", "Frosting de queso crema"],
    includes: ["Caja decorada", "Tarjeta o mensaje", "Combinación coordinada"],
    price: "Consultar por WhatsApp",
  },
];

export const categories = ["Tortas temáticas", "Postres clásicos"];

export const cakeFlavors = [
  "Queque de vainilla con chispas de chocolate",
  "Chocolate húmedo",
  "Red velvet",
  "Zanahoria con pecanas (+ S/20)",
  "Queque marmoleado de chocolate y vainilla (+ S/20)",
  "Naranja wando (+ S/20)",
];

export const fillingFlavors = [
  "Manjar de olla",
  "Fudge de olla",
  "Frosting de queso crema",
  "Mermelada de arándanos y fresas (+ S/15)",
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
