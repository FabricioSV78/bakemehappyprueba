# Configuración de Cloudflare Pages y los dos buckets R2

La aplicación usa dos flujos separados. El catálogo se descarga directamente
desde un dominio público conectado a R2; las fotografías de pedidos pasan por
Pages Functions y nunca exponen el bucket privado.

| Uso | Bucket | Acceso |
| --- | --- | --- |
| Imágenes del catálogo | `bake-me-happy-assets` | Público mediante dominio personalizado |
| Fotos temporales de pedidos | `bake-me-happy-private-uploads` | Privado mediante el binding `ORDER_UPLOADS` |

El bucket público no necesita un binding de Pages: el navegador lo consulta por
su dominio. Solo el bucket privado aparece en `wrangler.jsonc` porque las
Functions necesitan leerlo y escribirlo.

## 1. Configurar el bucket público

1. En Cloudflare abre **R2 Object Storage**.
2. Crea o selecciona `bake-me-happy-assets`.
3. En **Settings > Public access > Custom Domains**, conecta un subdominio como
   `assets.tudominio.com`.
4. Espera hasta que el dominio aparezca como **Active**.
5. Para producción, deja desactivado `r2.dev`; el dominio personalizado es el
   que aprovecha la caché de Cloudflare.

Las claves deben conservar la misma estructura que `public`, por ejemplo:

```text
images/webp/TORTAS/tortas tematicas/Amor eterno/1.webp
```

No subas las imágenes a mano. Desde PowerShell, dentro de
`bakemehappyprueba`, ejecuta:

```powershell
npm.cmd run r2:check
npm.cmd run r2:sync
```

La primera sincronización sube todo. Las siguientes comparan un manifiesto de
administración dentro del mismo bucket y solo suben archivos nuevos o
modificados. También eliminan objetos que antes administraba el manifiesto y ya
no existen localmente. Los nombres se mantienen (`1.webp`, `2.webp`, `3.webp`),
de modo que no se crean copias por cada modificación.

Si el manifiesto remoto fue eliminado o necesitas reparar todo el contenido:

```powershell
npm.cmd run r2:sync:full
```

## 2. Activar las imágenes públicas en Pages

1. Abre **Workers & Pages > tu proyecto > Settings > Variables and Secrets**.
2. En **Production**, agrega esta variable de texto:

```text
VITE_R2_PUBLIC_URL=https://assets.tudominio.com
```

3. Agrega la misma variable a **Preview** si quieres probar R2 en los previews.
4. Inicia un nuevo despliegue, porque las variables `VITE_*` se incorporan
   durante la compilación de Vite.

No agregues una barra final. El sistema también la normaliza por seguridad y,
si la URL está vacía o es inválida, usa automáticamente `public/images`.

## 3. Configurar el bucket privado

1. En R2 crea o selecciona `bake-me-happy-private-uploads`.
2. Mantén desactivados tanto **Public Development URL** como **Custom Domains**.
3. En **Object lifecycle rules**, crea una regla activa con:
   - Nombre: `delete-temporary-uploads`
   - Prefijo: `temp-uploads/`
   - Acción: eliminar objetos después de `1 day`

La URL firmada deja de funcionar a las 24 horas exactas. La regla de ciclo de
vida es una segunda capa de limpieza; Cloudflare puede efectuar el borrado
físico poco después de cumplido el día.

## 4. Enlazar el bucket privado a Pages

El binding ya está declarado en `wrangler.jsonc`, tanto para producción como
para preview. Compruébalo también en el panel:

1. Ve a **Workers & Pages > tu proyecto > Settings > Bindings**.
2. Agrega un binding de tipo **R2 bucket**.
3. Variable name: `ORDER_UPLOADS`.
4. Bucket: `bake-me-happy-private-uploads`.
5. Hazlo para **Production** y **Preview** si el panel separa los entornos.
6. Vuelve a desplegar el proyecto.

En **Variables and Secrets**, crea como secreto cifrado:

```text
UPLOAD_LINK_SECRET=<valor aleatorio de al menos 32 caracteres>
```

No guardes ese valor en Git ni en `wrangler.jsonc`. Si un secreto se compartió
por chat, captura o cualquier medio no privado, rótalo en Cloudflare antes de
publicar.

Estas opciones no secretas ya están en `wrangler.jsonc` y no hace falta
duplicarlas en el panel:

```text
UPLOAD_LINK_TTL_SECONDS=86400
MAX_UPLOAD_BYTES=8388608
```

## 5. Configuración del despliegue Pages

Si el repositorio contiene la carpeta `bakemehappyprueba`, usa:

```text
Root directory: bakemehappyprueba
Build command: npm run build
Build output directory: dist
Node.js: 20 o superior
```

Con Pages conectado a Git, el flujo para cambios de imágenes es:

```powershell
npm.cmd run r2:sync
git add .
git commit -m "Actualiza imágenes del catálogo"
git push
```

Cloudflare compila y publica la copia local de respaldo. La sincronización R2
se realiza antes del `push` para que ninguna página nueva apunte a un objeto que
todavía no existe.

Para un despliegue manual con Wrangler puede usarse:

```powershell
npm.cmd run pages:deploy:r2
```

## 6. Pruebas finales

1. Abre la tienda publicada y revisa **DevTools > Network**.
2. Una imagen debe responder `200` desde `assets.tudominio.com`.
3. Inspecciona el elemento: `data-asset-source="r2"` confirma el origen remoto.
4. Bloquea temporalmente ese dominio desde DevTools y recarga. La imagen debe
   aparecer desde el dominio de Pages con `data-asset-source="local"`.
5. Envía un pedido personalizado con una foto. El enlace incluido en WhatsApp
   debe abrir la imagen, mientras el bucket sigue figurando como privado.
6. Ejecuta antes de publicar:

```powershell
npm.cmd run check
```
