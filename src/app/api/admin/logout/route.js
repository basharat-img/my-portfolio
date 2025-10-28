import { NextResponse } from "next/server";

import { ADMIN_TOKEN_COOKIE_NAME } from "@/lib/jwt";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Signed out successfully.",
  });

  response.cookies.set({
    name: ADMIN_TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
