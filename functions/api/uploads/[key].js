import {
  isValidUploadSignature,
  jsonResponse,
} from "../../_lib/uploadLinks.js";

const UPLOAD_PREFIX = "temp-uploads/";
const VALID_FILE_KEY = /^[0-9a-f-]{36}\.(?:jpg|png|webp)$/;

async function handleDownload(context) {
  const { request, env, params } = context;

  if (!env.ORDER_UPLOADS || !env.UPLOAD_LINK_SECRET) {
    return jsonResponse({ error: "Servicio no configurado." }, 503);
  }

  const fileKey = params.key;
  if (typeof fileKey !== "string" || !VALID_FILE_KEY.test(fileKey)) {
    return jsonResponse({ error: "Enlace no válido." }, 400);
  }

  const requestUrl = new URL(request.url);
  const expires = Number.parseInt(requestUrl.searchParams.get("expires") ?? "", 10);
  const signature = requestUrl.searchParams.get("signature") ?? "";
  const objectKey = `${UPLOAD_PREFIX}${fileKey}`;

  if (!Number.isSafeInteger(expires) || !signature) {
    return jsonResponse({ error: "Enlace no válido." }, 400);
  }

  const signatureIsValid = await isValidUploadSignature(
    env.UPLOAD_LINK_SECRET,
    objectKey,
    expires,
    signature,
  );
  if (!signatureIsValid) {
    return jsonResponse({ error: "Enlace no válido." }, 403);
  }

  const now = Math.floor(Date.now() / 1000);
  if (expires <= now) {
    await env.ORDER_UPLOADS.delete(objectKey);
    return jsonResponse({ error: "Este enlace ya venció." }, 410);
  }

  const object = await env.ORDER_UPLOADS.get(objectKey);
  if (!object) return jsonResponse({ error: "Imagen no encontrada." }, 404);

  const storedExpiry = Number.parseInt(object.customMetadata?.expiresAt ?? "", 10);
  if (Number.isSafeInteger(storedExpiry) && storedExpiry <= now) {
    await env.ORDER_UPLOADS.delete(objectKey);
    return jsonResponse({ error: "Este enlace ya venció." }, 410);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", `private, max-age=${Math.min(300, expires - now)}, no-transform`);
  headers.set("Content-Disposition", "inline");
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");

  return new Response(object.body, { headers });
}

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return jsonResponse({ error: "Método no permitido." }, 405);
  }

  try {
    return await handleDownload(context);
  } catch (error) {
    console.error(JSON.stringify({
      event: "temporary_upload_download_failed",
      path: new URL(context.request.url).pathname,
      message: error instanceof Error ? error.message : String(error),
    }));
    return jsonResponse(
      { error: "No se pudo recuperar la imagen. Inténtalo nuevamente." },
      500,
    );
  }
}
