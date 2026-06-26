# Bake Me Happy

Sitio web informativo con vistas para una pastelería artesanal.

## Vistas

- Inicio: presentación, galería breve, preguntas frecuentes, testimonios, ubicación y contacto.
- Quiénes somos: historia del negocio y proceso de elaboración.
- Catálogo: tortas temáticas y postres clásicos.
- Cómo hago mi pedido: pasos de reserva, pago y coordinación.

## Desarrollo

```bash
npm install
npm run dev
```

## Personalización

- Datos de WhatsApp, Instagram, horario y ubicación: `src/data/site.js`
- Productos, precios y categorías: `src/data/products.js`
- Testimonios: `src/data/testimonials.js`
- Imágenes: `public/images`

El número de WhatsApp debe escribirse con código de país y sin espacios ni
símbolos. Por ejemplo: `51999999999`.

## Producción

```bash
npm run build
```
