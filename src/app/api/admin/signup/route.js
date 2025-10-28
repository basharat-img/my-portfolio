import { NextResponse } from "next/server";
import { getAdminsCollection } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

const SINGLE_WORD_PATTERN = /^\S+$/;

export async function POST(request) {
  try {
    const { email, username, password } = await request.json();

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

    const admins = await getAdminsCollection();

    const existing = await admins.findOne({
      $or: [{ username }, { email }],
    });

    if (existing) {
      const message =
        existing.username === username
          ? "An admin with that username already exists."
          : "An admin with that email already exists.";
      return NextResponse.json(
        { message },
        { status: 409 },
      );
    }

    const hashedPassword = hashPassword(password);
    const timestamp = new Date().toISOString();

    await admins.insertOne({
      email,
      username,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

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
