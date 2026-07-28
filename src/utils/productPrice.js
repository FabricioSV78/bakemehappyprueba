function getCurrencyAmount(value) {
  if (!value || !value.toLowerCase().includes("s/")) return null;

  const [, rawAmount] = value.match(/s\/\s*([\d.,]+)/i) ?? [];
  const amount = Number(rawAmount?.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

function formatSoles(amount) {
  return `S/ ${new Intl.NumberFormat("es-PE").format(amount)}`;
}

export function getProductPriceLabel(product) {
  const numericPrices = (product.prices ?? [])
    .map((price) => getCurrencyAmount(price))
    .filter((price) => price !== null);
  const variablePrice = (product.prices?.length ?? 0) > 1;

  if (numericPrices.length) {
    const minimumPrice = Math.min(...numericPrices);
    return variablePrice
      ? `Desde ${formatSoles(minimumPrice)}`
      : formatSoles(minimumPrice);
  }

  if (product.price) {
    const price = getCurrencyAmount(product.price);
    if (price !== null && product.price.toLowerCase().includes("desde")) {
      return `Desde ${formatSoles(price)}`;
    }

    return product.price;
  }

  return "Consultar";
}
