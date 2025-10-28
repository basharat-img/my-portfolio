import { NextResponse } from "next/server";
import { callMongoDataApi } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

const SINGLE_WORD_PATTERN = /^\S+$/;

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 },
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

    const existing = await callMongoDataApi("findOne", {
      filter: { username },
    });

    if (existing.document) {
      return NextResponse.json(
        { message: "An admin with that username already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = hashPassword(password);
    const timestamp = new Date().toISOString();

    await callMongoDataApi("insertOne", {
      document: {
        username,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
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
