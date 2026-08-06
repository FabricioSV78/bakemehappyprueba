const encoder = new TextEncoder();

function bytesToBase64Url(bytes) {
  let binary = "";

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;

  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);

  return crypto.subtle.timingSafeEqual(leftHash, rightHash);
}

export function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function getUploadConfig(env) {
  const defaultMaxBytes = 8 * 1024 * 1024;
  const defaultTtlSeconds = 86400;
  const parsedLimit = Number.parseInt(env.MAX_UPLOAD_BYTES ?? "8388608", 10);
  const parsedTtl = Number.parseInt(env.UPLOAD_LINK_TTL_SECONDS ?? "86400", 10);
  const configuredLimit = Number.isFinite(parsedLimit) && parsedLimit > 0
    ? parsedLimit
    : defaultMaxBytes;
  const configuredTtl = Number.isFinite(parsedTtl) && parsedTtl > 0
    ? parsedTtl
    : defaultTtlSeconds;

  return {
    maxBytes: Math.min(configuredLimit, defaultMaxBytes),
    ttlSeconds: Math.min(Math.max(configuredTtl, 60), defaultTtlSeconds),
  };
}

export function detectImageType(bytes) {
  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;
  if (isJpeg) return { extension: "jpg", contentType: "image/jpeg" };

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const isPng =
    bytes.length >= pngSignature.length &&
    pngSignature.every((value, index) => bytes[index] === value);
  if (isPng) return { extension: "png", contentType: "image/png" };

  const ascii = (start, text) =>
    [...text].every((character, index) => bytes[start + index] === character.charCodeAt(0));
  const isWebp = bytes.length >= 12 && ascii(0, "RIFF") && ascii(8, "WEBP");
  if (isWebp) return { extension: "webp", contentType: "image/webp" };

  return null;
}

export async function signUploadLink(secret, objectKey, expires) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${objectKey}:${expires}`),
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function isValidUploadSignature(secret, objectKey, expires, signature) {
  const expected = await signUploadLink(secret, objectKey, expires);
  return safeEqual(expected, signature);
}
