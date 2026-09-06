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

function uploadError(code, error, status) {
  return jsonResponse({ code, error }, status);
}

async function handleUpload(context) {
  const { request, env } = context;

  if (!hasRequiredBindings(env)) {
    return uploadError(
      "UPLOADS_UNAVAILABLE",
      "La subida de fotos no está disponible en este momento. Quita la foto para continuar sin ella o inténtalo más tarde.",
      503,
    );
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (!origin || origin !== requestUrl.origin) {
    return uploadError(
      "INVALID_ORIGIN",
      "No pudimos validar la solicitud. Recarga la página y vuelve a intentarlo.",
      403,
    );
  }

  const { maxBytes, ttlSeconds } = getUploadConfig(env);
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return uploadError(
      "INVALID_REQUEST_FORMAT",
      "No pudimos reconocer el archivo enviado. Selecciona nuevamente una imagen JPG, PNG o WebP.",
      415,
    );
  }

  const contentLength = Number.parseInt(
    request.headers.get("Content-Length") ?? "",
    10,
  );
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
    return uploadError(
      "UNKNOWN_FILE_SIZE",
      "No pudimos verificar el tamaño de la foto. Selecciónala nuevamente e inténtalo otra vez.",
      411,
    );
  }
  if (contentLength > maxBytes + 128 * 1024) {
    return uploadError(
      "FILE_TOO_LARGE",
      "La imagen supera el máximo permitido de 8 MB. Reduce su tamaño o elige otra.",
      413,
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return uploadError(
      "UNREADABLE_UPLOAD",
      "No pudimos leer la imagen. Puede estar dañada; guárdala nuevamente o elige otra.",
      400,
    );
  }

  const photo = formData.get("photo");
  if (!photo || typeof photo.arrayBuffer !== "function") {
    return uploadError(
      "MISSING_FILE",
      "No recibimos ninguna foto. Selecciona una imagen e inténtalo nuevamente.",
      400,
    );
  }

  if (photo.size <= 0) {
    return uploadError(
      "EMPTY_FILE",
      "El archivo está vacío o dañado. Elige otra imagen.",
      400,
    );
  }

  if (photo.size > maxBytes) {
    return uploadError(
      "FILE_TOO_LARGE",
      "La imagen supera el máximo permitido de 8 MB. Reduce su tamaño o elige otra.",
      413,
    );
  }

  if (!ACCEPTED_BROWSER_TYPES.has(photo.type)) {
    return uploadError(
      "UNSUPPORTED_FILE_TYPE",
      "Formato no compatible. Elige una imagen JPG, PNG o WebP.",
      415,
    );
  }

  const buffer = await photo.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detectedType = detectImageType(bytes);
  if (!detectedType || detectedType.contentType !== photo.type) {
    return uploadError(
      "INVALID_IMAGE_CONTENT",
      "El archivo no contiene una imagen válida o está dañado. Guárdalo nuevamente como JPG, PNG o WebP y vuelve a intentarlo.",
      415,
    );
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
    return uploadError(
      "UPLOAD_FAILED",
      "No pudimos guardar la foto por un problema temporal. Inténtalo nuevamente en unos minutos.",
      500,
    );
  }
}
