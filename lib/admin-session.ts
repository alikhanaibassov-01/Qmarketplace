/**
 * Единый токен сессии для Edge (middleware) и Node (Server Actions).
 * Значение cookie сравнивается посимвольно с HMAC(password).
 */
export async function computeAdminSessionToken(
  secret: string,
  password: string
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidAdminSessionToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!token || !secret || !password) return false;
  const expected = await computeAdminSessionToken(secret, password);
  return timingSafeEqualHex(token, expected);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
