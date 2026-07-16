import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn(
      "⚠️  SESSION_SECRET is not set. Using insecure default. Set it in .env or Vercel env vars."
    );
    return "insecure-default-change-me";
  }
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn(
      "⚠️  ADMIN_PASSWORD is not set. Admin login is disabled. Set it in .env or Vercel env vars."
    );
    return "__ADMIN_DISABLED__"; // Can't match any real password
  }
  return password;
}

/**
 * Verify a password against the env-configured admin password.
 * Returns a signed session token if valid, null otherwise.
 */
export function verifyAdminPassword(password: string): string | null {
  if (!password) return null;
  const expected = getAdminPassword();
  // Constant-time-ish comparison
  if (password.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < password.length; i++) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return null;

  // Issue a signed token: expiresAt.signature
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${expiresAt}`;
  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

/**
 * Set the admin session cookie. Call from a Server Action or route handler
 * with access to cookies().
 */
export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * Verify the session cookie from the request. Returns true if valid & not expired.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  // Constant-time comparison
  if (sig.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export { COOKIE_NAME };
