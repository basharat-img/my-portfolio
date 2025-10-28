import { NextResponse } from "next/server";

import { findAdminByEmail } from "@/lib/models/admin";
import {
  ADMIN_TOKEN_COOKIE_NAME,
  verifyAdminToken,
} from "@/lib/jwt";

function unauthorisedResponse(message = "Admin session is not valid.") {
  const response = NextResponse.json(
    { authenticated: false, message },
    { status: 401 },
  );

  response.cookies.set({
    name: ADMIN_TOKEN_COOKIE_NAME,
    value: "",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}

export async function GET(request) {
  try {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return unauthorisedResponse("Admin authentication token is missing.");
    }

    const payload = verifyAdminToken(token);

    if (!payload?.email) {
      return unauthorisedResponse("Admin authentication token could not be verified.");
    }

    const admin = await findAdminByEmail(payload.email);

    if (!admin) {
      return unauthorisedResponse("Admin account could not be found.");
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Admin session error", error);
    return NextResponse.json(
      { message: "Unable to verify admin session." },
      { status: 500 },
    );
  }
}
