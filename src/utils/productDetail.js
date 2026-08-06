import { products, sizeGuide } from "../data/products";

export function getProductId(path) {
  return Number(path.replace("/producto/", ""));
}

export function getOptionValue(option) {
  return option?.label ?? option ?? "";
}

export function getOptionSurcharge(options, selectedValue) {
  const selectedOption = options.find(
    (option) => getOptionValue(option) === selectedValue,
  );

  return selectedOption?.surcharge ?? 0;
}

export function getCurrencyAmount(value) {
  if (!value || !value.toLowerCase().includes("s/")) return null;

  const [, rawAmount] = value.match(/s\/\s*([\d.,]+)/i) ?? [];
  const amount = Number(rawAmount?.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

export function formatSoles(amount) {
  return `S/ ${amount}`;
}

export function formatQuantityLabel(quantity) {
  return `${quantity} ${quantity === 1 ? "unidad" : "unidades"}`;
}

export function getSelectHelper(options, value) {
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value,
  );
  const selectedSurcharge =
    typeof selectedOption === "object" ? selectedOption.surcharge ?? 0 : 0;
  const selectedDetailValue =
    typeof selectedOption === "object"
      ? selectedOption.value ?? selectedOption.helper
      : null;

  if (selectedSurcharge > 0) {
    return `Adicional ${formatSoles(selectedSurcharge)}`;
  }
  if (selectedDetailValue && /s\/|consultar/i.test(selectedDetailValue)) {
    return selectedDetailValue;
  }

  return null;
}

export function getStartingPriceLabel(product) {
  const numericPrices = (product?.prices ?? [])
    .map((price) => getCurrencyAmount(price))
    .filter((price) => price !== null);
  const variablePrice = (product?.prices?.length ?? 0) > 1;

  if (numericPrices.length) {
    const minimumPrice = Math.min(...numericPrices);
    return variablePrice
      ? `Desde ${formatSoles(minimumPrice)}`
      : formatSoles(minimumPrice);
  }

  const numericPrice = getCurrencyAmount(product?.price);
  if (numericPrice !== null) {
    return product.price.toLowerCase().includes("desde")
      ? `Desde ${formatSoles(numericPrice)}`
      : formatSoles(numericPrice);
  }

  return product?.price ?? "Consultar";
}

export function getPreparationTime(product) {
  if (product?.preparationTime) return product.preparationTime;

  const preparationByCategory = {
    "Tortas clasicas": "2 a 3 dias habiles",
    "Tortas tematicas": "24 horas",
    "Bocaditos tematicos": "4 a 5 dias habiles",
    Complementos: "24 a 48 horas",
    "Mini tortas": "2 a 3 dias habiles",
  };

  return preparationByCategory[product?.category] ?? "segun coordinacion";
}

export function getPriceOptions(product) {
  if (product?.prices?.length) {
    return product.prices.map((price) => {
      const [label, value] = price.split(":");
      return {
        label: label?.trim() || price,
        value: value?.trim() || "Consultar",
      };
    });
  }

  return [
    {
      label: product?.servings ?? "Segun pedido",
      value: product?.price ?? "Consultar",
    },
  ];
}

function getPortionKey(value) {
  const [, amount] = value?.match(/(\d+)/) ?? [];
  return amount ?? "";
}

export function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value) {
  const date = parseLocalDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDisplayTime(value) {
  if (!value) return "";

  const [rawHours, minutes] = value.split(":");
  const hours = Number(rawHours);
  const period = hours < 12 ? "a. m." : "p. m.";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
}

function getGuideLabel(size) {
  return `${size.portions} - ${size.name}`;
}

function findPriceByLabel(prices, label) {
  const labelKey = getPortionKey(label);

  return prices.find((price) => {
    if (price.label.toLowerCase() === label.toLowerCase()) return true;
    return labelKey && getPortionKey(price.label) === labelKey;
  });
}

export function getSizeOptions(product) {
  const productName = product?.name.toLowerCase() ?? "";
  const prices = getPriceOptions(product);
  const hasTwoTierTag = product?.tags?.some(
    (tag) => tag.toLowerCase() === "2 pisos",
  );

  if (hasTwoTierTag) {
    return prices.map((price) => ({
      label: price.label,
      value: price.value,
      helper: "Torta de 2 pisos",
    }));
  }

  if (productName.includes("two")) {
    return sizeGuide.twoTiers.map((size) => ({
      label: getGuideLabel(size),
      value: findPriceByLabel(prices, size.name)?.value ?? "Consultar",
      helper: size.dimensions,
    }));
  }

  if (productName.includes("tiny")) {
    const tinySize = sizeGuide.special.find(
      (size) => size.name.toLowerCase() === "tiny cake",
    );

    if (tinySize) {
      return [
        {
          label: getGuideLabel(tinySize),
          value: product?.price ?? "Consultar",
          helper: tinySize.dimensions,
        },
      ];
    }
  }

  if (product?.category === "Tortas tematicas") {
    return prices.map((price) => {
      const normalizedLabel = price.label.toLowerCase();
      const isHeartCake =
        productName.includes("heart") ||
        productName.includes("corazon") ||
        productName.includes("corazón");
      const matchingSize = normalizedLabel.includes("tiny")
        ? sizeGuide.special.find(
            (size) => size.name.toLowerCase() === "tiny cake",
          )
        : isHeartCake
          ? sizeGuide.special.find(
              (size) =>
                size.name.toLowerCase().includes("corazon") &&
                getPortionKey(size.portions) === getPortionKey(price.label),
            )
          : sizeGuide.oneTier.find(
              (size) =>
                getPortionKey(size.portions) === getPortionKey(price.label),
            );

      return {
        label: matchingSize ? getGuideLabel(matchingSize) : price.label,
        value: price.value,
        helper: matchingSize?.dimensions ?? "Precio base",
      };
    });
  }

  return prices.map((size) => ({
    label: size.label,
    value: size.value,
    helper: "Precio base",
  }));
}

export function isPersonalizedCake(product) {
  return product?.category === "Tortas tematicas";
}

export function isClassicCake(product) {
  return product?.category === "Tortas clasicas";
}

export function isMiniCake(product) {
  return product?.category === "Mini tortas";
}

export function isThemedBite(product) {
  return product?.category === "Bocaditos tematicos";
}

export function isComplement(product) {
  return product?.category === "Complementos";
}

export function getComplementOptions(currentProductId) {
  return products.filter(
    (item) => item.category === "Complementos" && item.id !== currentProductId,
  );
}
