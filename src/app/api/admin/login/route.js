import { NextResponse } from "next/server";
import { findAdminByEmail } from "@/lib/models/admin";
import { verifyPassword } from "@/lib/password";

const SINGLE_WORD_PATTERN = /^\S+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const payload = await request.json();
    const email = payload?.email?.trim();
    const password = payload?.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 422 },
      );
    }

    if (!SINGLE_WORD_PATTERN.test(password)) {
      return NextResponse.json(
        { message: "Password must be a single word without spaces." },
        { status: 422 },
      );
    }

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const passwordMatches = verifyPassword(password, admin.password);

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json(
      { message: "Unable to process the login request." },
      { status: 500 },
    );
  }
}
