import crypto from "crypto";

export const ADMIN_TOKEN_COOKIE_NAME = "admin_token";
export const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

const JWT_HEADER = Object.freeze({ alg: "HS256", typ: "JWT" });

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not configured.");
  }

  return secret;
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(unsignedToken, secret) {
  return crypto.createHmac("sha256", secret).update(unsignedToken).digest("base64url");
}

function toUnsignedToken(header, payload) {
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}

export function createAdminToken(admin) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    sub: admin?._id ? String(admin._id) : undefined,
    email: admin?.email,
    username: admin?.username,
    iat: issuedAt,
    exp: issuedAt + ADMIN_TOKEN_MAX_AGE,
  };

  const unsignedToken = toUnsignedToken(JWT_HEADER, payload);
  const signature = createSignature(unsignedToken, getJwtSecret());

  return `${unsignedToken}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token) {
    return null;
  }

  const segments = token.split(".");

  if (segments.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = segments;

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createSignature(unsignedToken, getJwtSecret());

  const receivedBuffer = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  const signaturesMatch = crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!signaturesMatch) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === "number" && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Failed to parse admin token payload", error);
    return null;
  }
}
