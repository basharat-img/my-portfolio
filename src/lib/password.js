import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  const [salt, originalKey] = storedHash.split(":");

  if (!salt || !originalKey) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  try {
    return timingSafeEqual(
      Buffer.from(derivedKey, "hex"),
      Buffer.from(originalKey, "hex"),
    );
  } catch (error) {
    return false;
  }
}
