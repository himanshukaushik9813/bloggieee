import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const token = await authenticate(email, password);
  if (!token) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });
  return response;
}
