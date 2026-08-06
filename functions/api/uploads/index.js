import {
  detectImageType,
  getUploadConfig,
  jsonResponse,
  signUploadLink,
} from "../../_lib/uploadLinks.js";

const UPLOAD_PREFIX = "temp-uploads/";
const ACCEPTED_BROWSER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasRequiredBindings(env) {
  return Boolean(env.ORDER_UPLOADS && env.UPLOAD_LINK_SECRET);
}

async function handleUpload(context) {
  const { request, env } = context;

  if (!hasRequiredBindings(env)) {
    return jsonResponse(
      { error: "El servicio de imágenes todavía no está configurado." },
      503,
    );
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (!origin || origin !== requestUrl.origin) {
    return jsonResponse({ error: "Origen de solicitud no permitido." }, 403);
  }

  const { maxBytes, ttlSeconds } = getUploadConfig(env);
  const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);
  if (contentLength > maxBytes + 128 * 1024) {
    return jsonResponse({ error: "La imagen supera el límite de 8 MB." }, 413);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "No se pudo leer la imagen enviada." }, 400);
  }

  const photo = formData.get("photo");
  if (!photo || typeof photo.arrayBuffer !== "function") {
    return jsonResponse({ error: "Selecciona una imagen válida." }, 400);
  }

  if (!ACCEPTED_BROWSER_TYPES.has(photo.type) || photo.size <= 0 || photo.size > maxBytes) {
    return jsonResponse(
      { error: "Usa una imagen JPG, PNG o WebP de hasta 8 MB." },
      photo.size > maxBytes ? 413 : 415,
    );
  }

  const buffer = await photo.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detectedType = detectImageType(bytes);
  if (!detectedType || detectedType.contentType !== photo.type) {
    return jsonResponse({ error: "El contenido del archivo no es una imagen válida." }, 415);
  }

  const id = crypto.randomUUID();
  const fileKey = `${id}.${detectedType.extension}`;
  const objectKey = `${UPLOAD_PREFIX}${fileKey}`;
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;

  await env.ORDER_UPLOADS.put(objectKey, buffer, {
    httpMetadata: { contentType: detectedType.contentType },
    customMetadata: { expiresAt: String(expires) },
  });

  const signature = await signUploadLink(env.UPLOAD_LINK_SECRET, objectKey, expires);
  const temporaryUrl = new URL(`/api/uploads/${fileKey}`, requestUrl.origin);
  temporaryUrl.searchParams.set("expires", String(expires));
  temporaryUrl.searchParams.set("signature", signature);

  return jsonResponse(
    {
      url: temporaryUrl.toString(),
      expiresAt: new Date(expires * 1000).toISOString(),
    },
    201,
  );
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return jsonResponse({ error: "Método no permitido." }, 405);
  }

  try {
    return await handleUpload(context);
  } catch (error) {
    console.error(JSON.stringify({
      event: "temporary_upload_failed",
      path: new URL(context.request.url).pathname,
      message: error instanceof Error ? error.message : String(error),
    }));
    return jsonResponse(
      { error: "No se pudo procesar la imagen. Inténtalo nuevamente." },
      500,
    );
  }
}
