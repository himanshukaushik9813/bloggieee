import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@123";
const JWT_SECRET = new TextEncoder().encode("blog-app-super-secret-key-2026");

export async function authenticate(email: string, password: string): Promise<string | null> {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);
    return token;
  }
  return null;
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
