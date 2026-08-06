import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MessageCircle,
  Ruler,
} from "lucide-react";
import { getWhatsAppUrl } from "../data/site";
import { cakeFlavors, fillingFlavors, products } from "../data/products";
import Reveal from "../components/Reveal";
import ComplementAddOns from "../components/product-detail/ComplementAddOns";
import ProductGallery from "../components/product-detail/ProductGallery";
import {
  ClassicSizeOptionsField,
  DateTimeFields,
  DeliveryOptions,
  GiftCandleOptions,
  QuantityControls,
  QuantityField,
  SelectField,
  SelectInput,
  TextAreaField,
  TextField,
} from "../components/product-detail/ProductFormFields";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatQuantityLabel,
  formatSoles,
  getComplementOptions,
  getCurrencyAmount,
  getOptionSurcharge,
  getOptionValue,
  getPreparationTime,
  getProductId,
  getSelectHelper,
  getSizeOptions,
  getStartingPriceLabel,
  isClassicCake,
  isComplement,
  isMiniCake,
  isPersonalizedCake,
  isThemedBite,
} from "../utils/productDetail";
import SizeGuideModal from "../components/SizeGuideModal";

const EMPTY_OPTIONS = [];
const DETAIL_CONTAINER_CLASS =
  "mx-auto w-full max-w-[1660px] px-4 min-[380px]:px-5 sm:px-8 2xl:px-12";
const FORM_FIELD_STACK_CLASS = "grid min-w-0 content-start gap-2";
const FORM_FIELD_LABEL_CLASS = "text-sm font-semibold leading-5 text-ink/72";

export default function ProductPage({ currentPath }) {
  const productId = getProductId(currentPath);
  const product = products.find((item) => item.id === productId);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const classicCake = isClassicCake(product);
  const personalizedCake = isPersonalizedCake(product);
  const miniCake = isMiniCake(product);
  const biteProduct = isThemedBite(product);
  const complementProduct = isComplement(product);
  const quantityProduct = miniCake || biteProduct || complementProduct;

  const sizeOptions = useMemo(() => getSizeOptions(product), [product]);
  const flavorOptions = useMemo(() => {
    if (personalizedCake) return cakeFlavors;
    return product?.flavors?.length ? product.flavors : EMPTY_OPTIONS;
  }, [personalizedCake, product]);
  const fillingOptions = useMemo(() => {
    if (personalizedCake) return fillingFlavors;
    return product?.fillings?.length ? product.fillings : EMPTY_OPTIONS;
  }, [personalizedCake, product]);
  const complementOptions = useMemo(
    () => getComplementOptions(productId),
    [productId],
  );
  const hasFlavorSelection = !classicCake && !complementProduct && flavorOptions.length > 0;
  const hasFillingSelection =
    !classicCake && !complementProduct && fillingOptions.length > 0;
  const showComplementAddOns =
    (classicCake || personalizedCake || miniCake) && complementOptions.length > 0;
  const showGiftCandleOption = classicCake || personalizedCake || miniCake;

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.label ?? "");
  const [selectedFlavor, setSelectedFlavor] = useState(
    getOptionValue(flavorOptions[0]),
  );
  const [selectedFilling, setSelectedFilling] = useState(
    getOptionValue(fillingOptions[0]),
  );
  const [theme, setTheme] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState("Recojo coordinado");
  const [giftCandle, setGiftCandle] = useState("No");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedComplements, setSelectedComplements] = useState({});
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    setSelectedSize(sizeOptions[0]?.label ?? "");
    setSelectedFlavor(getOptionValue(flavorOptions[0]));
    setSelectedFilling(getOptionValue(fillingOptions[0]));
    setTheme("");
    setColorPalette("");
    setAdditionalInfo("");
    setMessage("");
    setDelivery("Recojo coordinado");
    setGiftCandle("No");
    setDate("");
    setTime("");
    setQuantity(1);
    setSelectedComplements({});
    setActiveGalleryIndex(0);
  }, [fillingOptions, flavorOptions, productId, sizeOptions]);

  if (!product) {
    return (
      <section className="bg-cream px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-4xl text-ink">Producto no encontrado</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Este producto no está disponible en la tienda actual.
          </p>
          <a href="#/tienda" className="button-primary mt-6">
            Volver a la tienda
          </a>
        </div>
      </section>
    );
  }

  const selectedPrice = sizeOptions.find((size) => size.label === selectedSize);
  const referenceValue = selectedPrice?.value ?? product.price ?? "Consultar";
  const flavorSurcharge = personalizedCake
    ? getOptionSurcharge(flavorOptions, selectedFlavor)
    : 0;
  const fillingSurcharge = personalizedCake
    ? getOptionSurcharge(fillingOptions, selectedFilling)
    : 0;
  const totalSurcharge = flavorSurcharge + fillingSurcharge;
  const basePrice = getCurrencyAmount(selectedPrice?.value);
  const quantityTotal =
    quantityProduct && basePrice !== null ? basePrice * quantity : null;
  const estimatedTotal =
    quantityProduct
      ? quantityTotal
      : basePrice !== null
        ? basePrice + totalSurcharge
        : null;
  const selectedComplementItems = complementOptions
    .map((option) => ({
      ...option,
      quantity: selectedComplements[option.id] ?? 0,
      amount: getCurrencyAmount(option.price),
    }))
    .filter((option) => option.quantity > 0);
  const complementsTotal = selectedComplementItems.reduce(
    (total, option) =>
      option.amount !== null ? total + option.amount * option.quantity : total,
    0,
  );
  const hasComplementsTotal = complementsTotal > 0;
  const orderTotal =
    estimatedTotal !== null ? estimatedTotal + complementsTotal : estimatedTotal;
  const finalPriceLabel =
    orderTotal !== null
      ? formatSoles(orderTotal)
      : referenceValue;
  const finalPriceTitle =
    quantityProduct || personalizedCake ? "Total estimado" : "Total";
  const startingPriceLabel = getStartingPriceLabel(product);
  const preparationTime = getPreparationTime(product);

  function updateComplementQuantity(complementId, nextQuantity) {
    const normalizedQuantity = Math.max(
      0,
      Math.min(9, Number.parseInt(nextQuantity, 10) || 0),
    );

    setSelectedComplements((currentComplements) => {
      const nextComplements = { ...currentComplements };

      if (normalizedQuantity === 0) {
        delete nextComplements[complementId];
      } else {
        nextComplements[complementId] = normalizedQuantity;
      }

      return nextComplements;
    });
  }

  const whatsappMessage = [
    `Hola, vengo de la página web de Bake Me Happy. Quisiera cotizar: ${product.name}.`,
    quantityProduct
      ? `Presentacion: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`
      : `Tamaño: ${selectedSize}${selectedPrice?.value ? ` (${selectedPrice.value})` : ""}.`,
    miniCake && product.dimensions ? `Medida referencial: ${product.dimensions}.` : null,
    quantityProduct
      ? `Cantidad: ${miniCake ? formatQuantityLabel(quantity) : quantity}.`
      : null,
    quantityProduct && selectedFlavor ? `Sabor: ${selectedFlavor}.` : null,
    quantityProduct && selectedFilling ? `Relleno: ${selectedFilling}.` : null,
    miniCake ? "Acabado: Buttercream." : null,
    miniCake ? "Diseño: modelos disponibles según coordinación." : null,
    classicCake || quantityProduct
      ? null
      : `Sabor de queque: ${selectedFlavor}${flavorSurcharge ? ` (+ ${formatSoles(flavorSurcharge)})` : " (incluido)"}.`,
    classicCake || quantityProduct
      ? null
      : `Relleno: ${selectedFilling}${fillingSurcharge ? ` (+ ${formatSoles(fillingSurcharge)})` : " (incluido)"}.`,
    personalizedCake && totalSurcharge
      ? `Adicional por sabor y relleno: ${formatSoles(totalSurcharge)}.`
      : null,
    personalizedCake && theme ? `Temática: ${theme}.` : null,
    additionalInfo ? `Información adicional: ${additionalInfo}.` : null,
    showGiftCandleOption ? `Velita de regalo: ${giftCandle}.` : null,
    selectedComplementItems.length
      ? `Complementos: ${selectedComplementItems
          .map(
            (item) =>
              `${item.name} x${item.quantity}${
                item.price ? ` (${item.price})` : ""
              }`,
          )
          .join(", ")}.`
      : null,
    hasComplementsTotal && orderTotal !== null
      ? `Total estimado con complementos: ${formatSoles(orderTotal)}.`
      : null,
    message ? `Mensaje en la torta: ${message}.` : null,
    date ? `Fecha deseada: ${formatDisplayDate(date)}.` : null,
    time ? `Hora deseada: ${formatDisplayTime(time)}.` : null,
    `Entrega: ${delivery}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section className="overflow-x-hidden bg-cream pb-20 pt-24 sm:pb-28 sm:pt-28 lg:pt-[10.5rem]">
      <div className={DETAIL_CONTAINER_CLASS}>
        <a
          href="#/tienda"
          className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-lavender/30 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-plum/45 hover:text-plum"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Volver a la tienda
        </a>

        <div className="mt-5 grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal
            as="aside"
            direction="left"
            className="w-full min-w-0 self-start"
          >
            <ProductGallery
              product={product}
              activeIndex={activeGalleryIndex}
              onSelect={setActiveGalleryIndex}
            />
            {showComplementAddOns && (
              <ComplementAddOns
                variant="desktop"
                options={complementOptions}
                selectedItems={selectedComplements}
                onQuantityChange={updateComplementQuantity}
              />
            )}
          </Reveal>

          <section
            data-config-card="true"
            className="min-w-0 self-start rounded-lg border border-blush/30 bg-white shadow-soft"
          >
            <div className="brand-sprinkles overflow-hidden rounded-t-lg border-b border-blush/30 bg-[linear-gradient(135deg,#FFF4ED_0%,#ECEEFC_100%)] p-4 min-[380px]:p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-plum">
                    {product.category}
                  </span>
                  <h1 className="relative z-[1] mt-1.5 break-words font-display text-[2rem] font-semibold leading-tight text-ink min-[380px]:text-4xl sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-ink/65">
                    <CalendarDays size={16} aria-hidden="true" />
                    Listo en {preparationTime}
                  </p>
                </div>

                <div className="shrink-0 sm:min-w-44 sm:text-right">
                  <p className="text-2xl font-semibold tracking-[-0.02em] text-plum/85 sm:text-3xl">
                    {startingPriceLabel}
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-base leading-7 text-ink/68">
                {product.details}
              </p>

              {(product.prices?.length ?? 0) > 0 && (
                <div
                  className="mt-4 flex flex-wrap gap-2"
                  aria-label="Tamaños y precios disponibles"
                >
                  {product.prices.map((priceOption) => (
                    <span
                      key={priceOption}
                      className="max-w-full rounded-full border border-blush/30 bg-white/75 px-3 py-1.5 text-xs font-semibold leading-5 text-ink/72 min-[380px]:px-3.5 sm:text-sm"
                    >
                      {priceOption}
                    </span>
                  ))}
                </div>
              )}

              {miniCake && (
                <div className="mt-5 rounded-md border border-blush/30 bg-white/70 px-4 py-3 text-sm leading-6 text-ink/68">
                  <p>
                    <span className="font-semibold text-ink">Receta fija:</span>{" "}
                    {product.flavors?.[0]} relleno de {product.fillings?.[0]} y
                    decorada con buttercream.
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-ink">Importante:</span>{" "}
                    modelos disponibles segun coordinacion.
                  </p>
                </div>
              )}

            </div>


            <div className="space-y-5 rounded-b-lg bg-white p-4 min-[380px]:p-5 sm:space-y-6 sm:p-7">
              <header className="border-b border-blush/35 pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                      Configura tu pedido
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-ink/62 sm:text-base">
                      Elige tus opciones y envía el pedido por WhatsApp.
                    </p>
                  </div>

                  {personalizedCake && (
                    <button
                      type="button"
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-blush/30 bg-cream/45 px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-plum/35 hover:text-plum"
                      onClick={() => setIsSizeGuideOpen(true)}
                    >
                      <Ruler size={17} aria-hidden="true" />
                      Guía de tamaños
                    </button>
                  )}
                </div>
              </header>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  1. Elige tus opciones
                </h3>
                <div className="mt-5 space-y-5">
                  {quantityProduct ? (
                    <>
                      {!biteProduct && (
                        <div className="rounded-lg border border-blush/30 bg-blush/10 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-ink">
                                {selectedSize || product.servings}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-ink/58">
                                {selectedPrice?.value ?? product.price ?? "Consultar"}
                              </p>
                              {product.dimensions && (
                                <p className="mt-1 text-sm leading-6 text-ink/52">
                                  {product.dimensions}
                                </p>
                              )}
                            </div>
                            {miniCake && (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-plum">
                                Buttercream
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {biteProduct ? (
                        <div className="grid gap-y-4">
                          <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <label className={FORM_FIELD_STACK_CLASS}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                Presentación
                              </span>
                              <SelectInput
                                name="size"
                                options={sizeOptions}
                                value={selectedSize}
                                onChange={setSelectedSize}
                              />
                              {getSelectHelper(sizeOptions, selectedSize) && (
                                <span className="text-sm leading-5 text-ink/55">
                                  {getSelectHelper(sizeOptions, selectedSize)}
                                </span>
                              )}
                            </label>
                            <div className={FORM_FIELD_STACK_CLASS}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                Cantidad
                              </span>
                              <QuantityControls
                                value={quantity}
                                onChange={setQuantity}
                              />
                            </div>
                          </div>
                          {hasFlavorSelection && (
                            <SelectField
                              label="Sabor"
                              name="flavor"
                              options={flavorOptions}
                              value={selectedFlavor}
                              onChange={setSelectedFlavor}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          {!miniCake && (
                            <SelectField
                              label="Presentación"
                              name="size"
                              options={sizeOptions}
                              value={selectedSize}
                              onChange={setSelectedSize}
                            />
                          )}

                          <QuantityField
                            value={quantity}
                            onChange={setQuantity}
                          />
                        </>
                      )}

                      {(hasFlavorSelection || hasFillingSelection) && !miniCake && !biteProduct && (
                        <div
                          className={`grid items-start gap-4 ${
                            hasFlavorSelection && hasFillingSelection
                              ? "sm:grid-cols-2"
                              : "sm:grid-cols-1"
                          }`}
                        >
                          {hasFlavorSelection && (
                            <SelectField
                              label="Sabor"
                              name="flavor"
                              options={flavorOptions}
                              value={selectedFlavor}
                              onChange={setSelectedFlavor}
                            />
                          )}
                          {hasFillingSelection && (
                            <SelectField
                              label="Relleno"
                              name="filling"
                              options={fillingOptions}
                              value={selectedFilling}
                              onChange={setSelectedFilling}
                            />
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    personalizedCake ? (
                      <div className="space-y-5">
                        <div
                          className={`grid items-start gap-4 ${
                            hasFillingSelection ? "sm:grid-cols-2" : "sm:grid-cols-1"
                          }`}
                        >
                          <SelectField
                            label="Tamaño"
                            name="size"
                            options={sizeOptions}
                            value={selectedSize}
                            onChange={setSelectedSize}
                          />
                          {hasFillingSelection && (
                            <SelectField
                              label="Relleno"
                              name="filling"
                              options={fillingOptions}
                              value={selectedFilling}
                              onChange={setSelectedFilling}
                            />
                          )}
                        </div>

                        {hasFlavorSelection && (
                          <SelectField
                            label="Sabor"
                            name="flavor"
                            options={flavorOptions}
                            value={selectedFlavor}
                            onChange={setSelectedFlavor}
                          />
                        )}
                      </div>
                    ) : classicCake ? (
                      <ClassicSizeOptionsField
                        value={selectedSize}
                        onChange={setSelectedSize}
                        options={sizeOptions}
                      />
                    ) : (
                      <SelectField
                        label="Tamaño"
                        name="size"
                        options={sizeOptions}
                        value={selectedSize}
                        onChange={setSelectedSize}
                      />
                    )
                  )}

                  {showComplementAddOns && (
                    <ComplementAddOns
                      variant="mobile"
                      options={complementOptions}
                      selectedItems={selectedComplements}
                      onQuantityChange={updateComplementQuantity}
                    />
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  2. Datos del pedido
                </h3>
                <div className="mt-5">
                  {classicCake ? (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      <TextField
                        label="Mensaje en la torta (opcional)"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumpleaños, Camila"
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. alergias o alguna indicación importante"
                      />
                    </div>
                  ) : quantityProduct ? (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {miniCake && showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      {!complementProduct && !biteProduct && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextField
                            label="Tematica"
                            value={theme}
                            onChange={setTheme}
                            placeholder="Ej. mariposas, safari, princesa"
                          />
                          <TextField
                            label="Colores"
                            value={colorPalette}
                            onChange={setColorPalette}
                            placeholder="Ej. rosa pastel y lavanda"
                          />
                        </div>
                      )}
                      <TextField
                        label={complementProduct ? "Detalle (opcional)" : "Mensaje (opcional)"}
                        value={message}
                        onChange={setMessage}
                        placeholder={
                          complementProduct
                            ? "Ej. incluir con torta principal"
                            : "Ej. Feliz cumple, Valeria"
                        }
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder={
                          complementProduct
                            ? "Ej. combinar con otro pedido"
                            : "Ej. empaque para regalo o alguna indicación importante"
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <DateTimeFields
                        date={date}
                        time={time}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                      />
                      {showGiftCandleOption && (
                        <GiftCandleOptions
                          value={giftCandle}
                          onChange={setGiftCandle}
                        />
                      )}
                      <TextField
                        label="Mensaje en la torta (opcional)"
                        value={message}
                        onChange={setMessage}
                        placeholder="Ej. Feliz cumple, Valeria"
                      />
                      <TextAreaField
                        label="Indicaciones (opcional)"
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        rows={3}
                        placeholder="Ej. alergias o alguna indicación importante"
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-blush/25 bg-cream/20 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-ink">
                  3. Entrega y total
                </h3>
                <div className="mt-5 space-y-5">
                  <DeliveryOptions delivery={delivery} onChange={setDelivery} />

                  <div className="rounded-xl border border-blush/30 bg-blush/10 px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-plum/75">
                          {finalPriceTitle}
                        </p>
                        <p className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">
                          {finalPriceLabel}
                        </p>
                        {selectedComplementItems.length > 0 && (
                          <p className="mt-2 text-sm font-medium text-ink/58">
                            Complementos agregados
                          </p>
                        )}
                      </div>
                      <div className="space-y-1 text-sm leading-6 text-ink/62 sm:text-right">
                        <p>
                          {delivery === "Recojo coordinado" ? "Recojo" : "Delivery"}
                        </p>
                        {date && <p>Fecha: {formatDisplayDate(date)}</p>}
                        {time && <p>Hora: {formatDisplayTime(time)}</p>}
                      </div>
                    </div>
                  </div>


                  <a
                    href={getWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-plum"
                  >
                    <MessageCircle size={19} aria-hidden="true" />
                    Pedir por WhatsApp
                  </a>
                </div>
              </section>
            </div>

          </section>
        </div>

      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
