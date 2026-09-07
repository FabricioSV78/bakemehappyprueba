# Bake Me Happy

Sitio web de Bake Me Happy para mostrar productos, configurar pedidos y enviar
solicitudes por WhatsApp.

## Lo más importante

Si el proyecto y Cloudflare ya están configurados, este es el flujo normal:

1. Realiza los cambios en el código, los productos o las imágenes.
2. Ejecuta `npm.cmd run check`.
3. Revisa los archivos modificados con `git status`.
4. Ejecuta `git add .`.
5. Ejecuta `git commit -m "Describe el cambio"`.
6. Ejecuta `git push`.
7. Cloudflare Pages compila la web, actualiza R2 y publica la nueva versión.

No es necesario subir las imágenes manualmente a R2.

## Accesos rápidos

- [Preparar el proyecto por primera vez](#4-preparar-el-proyecto-por-primera-vez).
- [Agregar un producto](#7-agregar-un-producto).
- [Reemplazar imágenes](#8-reemplazar-imágenes-existentes).
- [Publicar cambios](#11-publicar-cambios).
- [Configurar Cloudflare por primera vez](#configuración-de-cloudflare-por-primera-vez).
- [Resolver problemas frecuentes](#21-problemas-frecuentes).

---

## 1. Tecnologías utilizadas

- React 18.
- Vite 6.
- Tailwind CSS 3.
- Cloudflare Pages.
- Cloudflare Pages Functions.
- Dos buckets de Cloudflare R2.

## 2. Páginas de la web

- `/`: inicio.
- `/quienes-somos`: historia del negocio.
- `/tienda`: tienda, filtros y búsqueda.
- `/producto/:id`: detalle y configuración de un producto.
- `/pedido`: explicación del proceso de compra.

`/catalogo` es una dirección antigua. La aplicación la redirige a `/tienda`.

## 3. Requisitos

Antes de comenzar necesitas:

- Node.js 20 o superior.
- npm.
- Git.
- Una cuenta de Cloudflare para publicar.

Puedes comprobar las versiones con:

```powershell
node --version
npm.cmd --version
git --version
```

En PowerShell se usa `npm.cmd` para evitar el error de ejecución de
`npm.ps1`. En otras terminales también puedes usar `npm`.

## 4. Preparar el proyecto por primera vez

Si todavía no tienes el repositorio:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd bakemehappy\bakemehappyprueba
```

Si ya tienes el proyecto, abre una terminal directamente dentro de
`bakemehappyprueba`.

Instala las dependencias:

```powershell
npm.cmd install
```

Crea el archivo local de variables:

```powershell
Copy-Item .env.example .env
```

`.env` está ignorado por Git. No lo confirmes ni lo compartas.

Inicia la web:

```powershell
npm.cmd run dev
```

Abre la dirección que muestre Vite, normalmente
`http://localhost:5173`.

## 5. Probar la carga privada de fotos localmente

`npm.cmd run dev` prueba la interfaz, pero no ejecuta Pages Functions
localmente. Para probar una foto de referencia:

1. Crea el archivo local de secretos:

   ```powershell
   Copy-Item .dev.vars.example .dev.vars
   ```

2. Abre `.dev.vars`.
3. Cambia `UPLOAD_LINK_SECRET` por una cadena aleatoria de 32 caracteres o
   más.
4. Ejecuta:

   ```powershell
   npm.cmd run pages:dev
   ```

`.dev.vars` está ignorado por Git y nunca debe compartirse.

## 6. Dónde modificar el contenido

- WhatsApp, Instagram, horario y ubicación: `src/data/site.js`.
- Productos, precios, tamaños, categorías, sabores y rellenos:
  `src/data/products.js`.
- Testimonios: `src/data/testimonials.js`.
- Imágenes: `public/images`.
- Variables públicas y bindings: `wrangler.jsonc`.
- Plantilla de variables: `.env.example`.

El número de WhatsApp debe incluir el código de país y no debe contener
espacios ni símbolos. Ejemplo: `51999999999`.

## 7. Agregar un producto

1. Abre `src/data/products.js`.
2. Agrega el producto usando la misma estructura que los existentes.
3. Usa un `id` que no esté repetido.
4. Escribe correctamente nombre, categoría, descripción, precios, tamaños,
   sabores y rellenos.
5. Crea su carpeta de imágenes en una de estas ubicaciones:

   ```text
   public/images/webp/TORTAS/tortas clasicas/<producto>/
   public/images/webp/TORTAS/tortas tematicas/<producto>/
   public/images/webp/COMPLEMENTOS/<producto>/
   ```

6. Coloca `1.png`, `2.png` y `3.png` en esa carpeta.
7. Comprueba que la ruta escrita en `products.js` coincide exactamente con
   el nombre de la carpeta.
8. Ejecuta `npm.cmd run check`.
9. Abre la tienda y revisa la tarjeta y el detalle del producto.
10. Confirma todos los archivos generados con Git.

## 8. Reemplazar imágenes existentes

1. Entra en la carpeta del producto.
2. Reemplaza `1.png`, `2.png` o `3.png`.
3. Conserva exactamente el mismo nombre y extensión.
4. Ejecuta:

   ```powershell
   npm.cmd run check
   ```

5. El sistema actualizará automáticamente:
   - Los WebP principales.
   - Las variantes responsivas para celular, tablet y escritorio.
   - Los hashes usados para evitar imágenes antiguas en caché.
6. Ejecuta `git status` y confirma que aparecen el PNG, el WebP y
   `src/data/assetVersions.generated.js`.
7. Ejecuta `git add .`, `git commit` y `git push`.
8. En el build de Pages busca un mensaje parecido a:

   ```text
   R2 bake-me-happy-assets: 12 por subir
   Sincronizacion terminada.
   ```

La cantidad puede ser diferente. Si no cambiaste imágenes, es normal que diga
`0 por subir`.

No edites las carpetas `_responsive`. Se generan automáticamente y están
ignoradas por Git.

## 9. Eliminar un producto o sus imágenes

1. Elimina el producto de `src/data/products.js`.
2. Elimina únicamente su carpeta dentro de `public/images/webp`.
3. Ejecuta `npm.cmd run check`.
4. Verifica que la tienda siga funcionando.
5. Ejecuta `git add .`, `git commit` y `git push`.

Durante el despliegue, el sincronizador elimina de R2 solamente los objetos que
administraba su manifiesto y que ya no existen localmente.

## 10. Validar antes de publicar

Ejecuta siempre:

```powershell
npm.cmd run check
```

Este comando:

1. Revisa el código con ESLint.
2. Prepara las imágenes principales y responsivas.
3. Actualiza las versiones de los recursos.
4. Actualiza `sitemap.xml` y los archivos SEO.
5. Genera la carpeta `dist`.

El proceso debe terminar sin errores.

## 11. Publicar cambios

Después de validar:

```powershell
git status
git add .
git commit -m "Describe el cambio realizado"
git push
```

Solo los archivos incluidos en el commit llegan a Cloudflare. Un archivo que
permanece únicamente en tu computadora no puede actualizar Pages ni R2.

En la rama `main`, Cloudflare sigue este orden:

1. Descarga el commit.
2. Instala las dependencias.
3. Prepara las imágenes.
4. Compara los hashes locales con el manifiesto de R2.
5. Sube las imágenes nuevas o modificadas.
6. Elimina de R2 los objetos administrados que ya no existen.
7. Compila la aplicación.
8. Publica la nueva versión.

Si la sincronización de R2 falla, el build se detiene y permanece publicada la
versión anterior.

Las ramas de Preview no actualizan el bucket público. La sincronización está
limitada a `main` mediante `R2_SYNC_BRANCH`. Cambia ese valor solamente si
cambia la rama de producción.

---

# Configuración de Cloudflare por primera vez

Los pasos de esta sección se realizan una sola vez.

## 12. Crear el proyecto de Pages

1. En Cloudflare abre **Workers & Pages**.
2. Selecciona **Create application** y conecta el repositorio de Git.
3. Selecciona la rama `main`.
4. Configura:

   ```text
   Root directory: bakemehappyprueba
   Build command: npm run build
   Build output directory: dist
   Node.js: 20 o superior
   Production branch: main
   ```

5. Guarda la configuración.

La carpeta raíz es importante porque la aplicación está dentro de
`bakemehappyprueba`.

## 13. Crear los dos buckets de R2

En **R2 Object Storage**, crea:

| Bucket | Uso | Acceso |
| --- | --- | --- |
| `bake-me-happy-assets` | Imágenes de la web | Público |
| `bake-me-happy-private-uploads` | Fotos temporales de clientes | Privado |

También puedes crearlos desde una terminal autenticada:

```powershell
npx.cmd wrangler login
npx.cmd wrangler r2 bucket create bake-me-happy-assets
npx.cmd wrangler r2 bucket create bake-me-happy-private-uploads
```

## 14. Configurar el bucket público

1. Abre R2 y selecciona `bake-me-happy-assets`.
2. Abre **Settings**.
3. En **Public access**, conecta un dominio personalizado, por ejemplo
   `assets.tudominio.com`.
4. Espera a que aparezca como **Active**.
5. Copia la URL HTTPS.
6. Coloca esa URL en `VITE_R2_PUBLIC_URL` dentro de `wrangler.jsonc`.
7. No agregues una barra `/` al final.
8. Confirma el cambio en Git y vuelve a desplegar.

Actualmente puede utilizarse una dirección `r2.dev`, pero para producción se
recomienda un dominio personalizado. El dominio personalizado permite utilizar
la caché de Cloudflare y evita las limitaciones del dominio de desarrollo.

El bucket público no necesita un binding de Pages porque el navegador descarga
las imágenes directamente mediante su URL.

## 15. Configurar el bucket privado

1. Selecciona `bake-me-happy-private-uploads`.
2. Mantén desactivados **Public Development URL** y **Custom Domains**.
3. En **Object lifecycle rules**, crea una regla:
   - Nombre: `delete-temporary-uploads`.
   - Prefijo: `temp-uploads/`.
   - Acción: eliminar después de un día.
4. Guarda la regla.

El binding ya está declarado en `wrangler.jsonc`:

```text
Variable name: ORDER_UPLOADS
Bucket: bake-me-happy-private-uploads
```

Después del despliegue, comprueba en **Workers & Pages > proyecto > Settings >
Bindings** que `ORDER_UPLOADS` aparezca enlazado al bucket privado. Si lo
agregas manualmente desde el panel, usa exactamente el mismo nombre.

## 16. Crear el token correcto para sincronizar R2

No uses las credenciales S3 de R2. El build utiliza un API Token normal de
Cloudflare porque Wrangler administra los objetos mediante la API de
Cloudflare.

1. En Cloudflare abre **My Profile > API Tokens**.
2. Selecciona **Create Token**.
3. Selecciona **Create Custom Token**.
4. Escribe un nombre reconocible, por ejemplo
   `Bake Me Happy - sincronización R2`.
5. En permisos selecciona:

   ```text
   Account > Workers R2 Storage > Edit
   ```

6. En recursos de cuenta selecciona solamente la cuenta del proyecto.
7. No agregues permisos de DNS, administración ni facturación.
8. Continúa al resumen y crea el token.
9. Copia el valor inmediatamente; Cloudflare solo lo muestra una vez.
10. Guárdalo como `CLOUDFLARE_API_TOKEN` en los secretos de Pages.

Si necesitas ejecutar `npm.cmd run r2:sync` manualmente desde tu computadora,
completa estas líneas de tu `.env` local:

```text
VITE_R2_PUBLIC_URL=https://dominio-publico-del-bucket
CLOUDFLARE_ACCOUNT_ID=ID_DE_LA_CUENTA
CLOUDFLARE_API_TOKEN=TOKEN_CREADO
```

El archivo `.env` está ignorado por Git. Estos valores locales no reemplazan
los secretos configurados en Cloudflare Pages.

## 17. Agregar los secretos de Pages

Abre **Workers & Pages > proyecto > Settings > Variables and Secrets** y agrega
para **Production**:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ID de la cuenta de Cloudflare |
| Secret | `CLOUDFLARE_API_TOKEN` | Token creado en el paso anterior |
| Secret | `UPLOAD_LINK_SECRET` | Cadena aleatoria de 32 caracteres o más |

Es normal que `CLOUDFLARE_ACCOUNT_ID` aparezca cifrado si se guardó como
Secret. El sistema puede utilizarlo igualmente durante el build.

Puedes generar `UPLOAD_LINK_SECRET` en PowerShell con:

```powershell
$secretBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($secretBytes)
[Convert]::ToBase64String($secretBytes)
```

Copia el resultado directamente a Cloudflare. No lo guardes en README,
`wrangler.jsonc`, capturas, chats ni Git.

Estas variables no secretas ya están en `wrangler.jsonc` y no deben
duplicarse en el panel:

```text
VITE_SITE_URL
VITE_R2_PUBLIC_URL
R2_SYNC_ON_BUILD
R2_SYNC_BRANCH
R2_PUBLIC_BUCKET_NAME
UPLOAD_LINK_TTL_SECONDS
MAX_UPLOAD_BYTES
```

Cuando las variables están administradas por `wrangler.jsonc`, el panel puede
permitir crear únicamente secretos. Ese comportamiento es normal.

## 18. Realizar el primer despliegue

1. Confirma que los tres secretos existen en Production.
2. Confirma que `ORDER_UPLOADS` apunta al bucket privado.
3. Confirma que `VITE_R2_PUBLIC_URL` apunta al bucket público.
4. Ejecuta localmente `npm.cmd run check`.
5. Ejecuta `git add .`, `git commit` y `git push`.
6. Abre el despliegue en Cloudflare Pages.
7. Revisa el registro del build.
8. Comprueba que aparezca `Sincronizacion terminada`.
9. Espera a que el despliegue muestre estado correcto.

La primera sincronización puede subir muchas imágenes. Las siguientes solo
suben lo que cambió.

## 19. Comprobación final de producción

1. Abre el inicio.
2. Abre `/quienes-somos`.
3. Abre `/tienda` y aplica varios filtros.
4. Entra al detalle de una torta.
5. Comprueba las tres imágenes de la galería.
6. Comprueba que hoy y mañana estén deshabilitados en la fecha de entrega.
7. Comprueba que el horario disponible sea de 7:00 a. m. a 9:00 p. m.
8. Abre el pedido personalizado.
9. Sube una foto de prueba.
10. Comprueba que WhatsApp reciba el enlace privado.
11. Abre ese enlace y confirma que funcione.
12. Comprueba el enlace de Instagram, WhatsApp y el mapa.
13. Revisa la web en celular y escritorio.

Para comprobar el origen de una imagen:

1. Abre las herramientas del navegador.
2. Entra en **Network**.
3. Recarga la página.
4. Una imagen remota debe responder con estado `200` desde el dominio de R2.
5. Si R2 falla, la aplicación debe intentar la copia local.

## 20. Comandos disponibles

| Comando | Para qué sirve |
| --- | --- |
| `npm.cmd run dev` | Inicia solamente la interfaz local. |
| `npm.cmd run lint` | Revisa el código con ESLint. |
| `npm.cmd run build` | Prepara recursos y genera `dist`. |
| `npm.cmd run check` | Ejecuta ESLint y el build completo. |
| `npm.cmd run pages:dev` | Prueba Pages Functions localmente. |
| `npm.cmd run r2:check` | Verifica la configuración local de R2. |
| `npm.cmd run r2:sync` | Sincroniza manualmente las imágenes modificadas. |
| `npm.cmd run r2:sync:full` | Vuelve a subir todas las imágenes administradas. |
| `npm.cmd run r2:lifecycle` | Crea la regla de limpieza del bucket privado. |
| `npm.cmd run pages:deploy` | Publica Pages manualmente sin sincronizar R2 localmente. |
| `npm.cmd run pages:deploy:r2` | Sincroniza R2 y después publica Pages. |

El flujo normal conectado a Git solo necesita `git push`. Los comandos
manuales de R2 se reservan para la configuración inicial o la recuperación de
un manifiesto.

## 21. Problemas frecuentes

### R2 sigue mostrando una imagen anterior

1. Ejecuta `git status`.
2. Comprueba que el PNG, el WebP y
   `src/data/assetVersions.generated.js` estén en el commit.
3. Ejecuta `git status -sb` y confirma que `main` no esté adelantada a
   `origin/main`.
4. Revisa el build de Cloudflare.
5. Espera a que termine la sincronización antes de abrir la web.

Las imágenes utilizan un hash en la URL, por lo que no debería ser necesario
vaciar manualmente la caché.

### El build indica que falta `CLOUDFLARE_ACCOUNT_ID`

Agrégalo a **Variables and Secrets** de Production. Puede guardarse como
Secret.

### El build indica que falta `CLOUDFLARE_API_TOKEN`

Comprueba que el token esté guardado como Secret, que no haya vencido y que
tenga el permiso **Workers R2 Storage Edit** para la cuenta correcta.

### La foto de referencia no funciona localmente

Usa `npm.cmd run pages:dev`, no solamente `npm.cmd run dev`. Comprueba
también que exista `.dev.vars` con un `UPLOAD_LINK_SECRET` válido.

### PowerShell bloquea `npm.ps1`

Usa `npm.cmd` en lugar de `npm`.

### Se eliminó el manifiesto de R2

Después de comprobar el bucket correcto, ejecuta:

```powershell
npm.cmd run r2:sync:full
```

## 22. Reglas actuales de pedidos

- Fecha mínima: dos días calendario después de hoy.
- Horario de entrega o recojo: de 7:00 a. m. a 9:00 p. m.
- Fotos aceptadas: JPG, PNG o WebP.
- Tamaño máximo antes de optimizar: 8 MB.
- Duración del enlace privado: 24 horas.

## 23. Seguridad

- Nunca confirmes `.env` ni `.dev.vars`.
- Nunca guardes tokens o secretos en el código.
- Nunca habilites acceso público al bucket privado.
- Usa permisos mínimos para el token de R2.
- Si un secreto se expone, elimínalo y crea uno nuevo.

La explicación técnica ampliada de los dos buckets está en
[`docs/CLOUDFLARE_R2.md`](docs/CLOUDFLARE_R2.md).

## 24. Referencias oficiales

- [Configuración de builds de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/).
- [Bindings de Pages Functions](https://developers.cloudflare.com/pages/functions/bindings/).
- [Buckets públicos de R2](https://developers.cloudflare.com/r2/buckets/public-buckets/).
- [Creación de API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).
- [Variables de entorno reconocidas por Wrangler](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/).
