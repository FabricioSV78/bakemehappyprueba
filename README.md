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

La compilación genera `dist`, que es el directorio configurado para Cloudflare
Pages en `wrangler.jsonc`.

## Despliegue en Cloudflare Pages y R2

La arquitectura usa dos buckets distintos:

- `bake-me-happy-assets`: público, para las imágenes del sitio.
- `bake-me-happy-private-uploads`: privado, para las fotos temporales de clientes.

Separarlos es importante: el bucket privado impide acceder directamente a una
foto después de que venza su enlace firmado.

### 1. Crear los buckets

```bash
npx wrangler login
npx wrangler r2 bucket create bake-me-happy-assets
npx wrangler r2 bucket create bake-me-happy-private-uploads
```

En R2, conecta un dominio público solamente al bucket `bake-me-happy-assets`.
No habilites acceso público ni `r2.dev` en `bake-me-happy-private-uploads`.

### 2. Sincronizar las imágenes públicas

```bash
npm run r2:sync
```

El comando sube `public/images` con claves `images/...` y no elimina los
archivos locales. En Cloudflare Pages, agrega como variable de compilación:

```text
VITE_R2_PUBLIC_URL=https://assets.tudominio.com
```

Si la variable no existe, o una imagen remota falla, el sitio usa la copia de
`public/images` automáticamente.

### 3. Configurar las fotos temporales

En **Workers & Pages > Bake Me Happy > Settings > Variables and Secrets**, crea
el secreto `UPLOAD_LINK_SECRET` con un valor aleatorio largo (32 caracteres o
más). El binding `ORDER_UPLOADS` y el resto de variables ya están declarados en
`wrangler.jsonc`.

Activa además la limpieza automática del prefijo temporal:

```bash
npm run r2:lifecycle
```

El enlace firmado deja de funcionar exactamente al cumplirse 24 horas. Una
petición vencida elimina el objeto inmediatamente; la regla de ciclo de vida de
R2 elimina también los objetos que ya no vuelvan a solicitarse.

Para probar Pages Functions y R2 localmente, copia `.dev.vars.example` como
`.dev.vars`, cambia el secreto y ejecuta:

```bash
npm run pages:dev
```

`npm run dev` continúa disponible para trabajar solo con la interfaz; la carga
de fotos requiere `npm run pages:dev`.

### 4. Publicar

Al conectar el repositorio a Cloudflare Pages usa:

- Comando de compilación: `npm run build`
- Directorio de salida: `dist`
- Versión de Node recomendada: 20 o superior

También se puede desplegar manualmente con:

```bash
npm run pages:deploy
```
