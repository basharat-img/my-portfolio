import { NextResponse } from "next/server";
import {
  createAdmin,
  findAdminByEmail,
  findAdminByUsername,
} from "@/lib/models/admin";

const SINGLE_WORD_PATTERN = /^\S+$/;

export async function POST(request) {
  try {
    const payload = await request.json();

    const email = payload?.email?.trim();
    const username = payload?.username?.trim();
    const password = payload?.password?.trim();

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Email, username, and password are required." },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 422 },
      );
    }

    if (
      !SINGLE_WORD_PATTERN.test(username) ||
      !SINGLE_WORD_PATTERN.test(password)
    ) {
      return NextResponse.json(
        { message: "Each field must be a single word without spaces." },
        { status: 422 },
      );
    }

    const existingByUsername = await findAdminByUsername(username);
    if (existingByUsername) {
      return NextResponse.json(
        { message: "An admin with that username already exists." },
        { status: 409 },
      );
    }

    const existingByEmail = await findAdminByEmail(email);
    if (existingByEmail) {
      return NextResponse.json(
        { message: "An admin with that email already exists." },
        { status: 409 },
      );
    }

    await createAdmin({ email, username, password });

    return NextResponse.json(
      { message: "Admin account created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin signup error", error);
    return NextResponse.json(
      { message: "Failed to create admin account." },
      { status: 500 },
    );
  }
}
