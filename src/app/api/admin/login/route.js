import { NextResponse } from "next/server";

const singleWordRegex = /^\S+$/;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "secret";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = body?.username?.trim();
    const password = body?.password?.trim();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    if (!singleWordRegex.test(username) || !singleWordRegex.test(password)) {
      return NextResponse.json(
        { message: "Credentials must each be a single word without spaces." },
        { status: 400 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to process the login request." },
      { status: 500 }
    );
  }
}
