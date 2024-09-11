import { NextRequest, NextResponse } from "next/server";

export async function validateRegister(req: NextRequest) {
  const body = await req.json();

  const {
    email,
    password,
    username,
    name,
    dateOfBirth,
    country,
    state,
    image,
  } = body.data;

  if (
    !email ||
    !password ||
    !username ||
    !name ||
    !dateOfBirth ||
    !country ||
    !state ||
    !image
  ) {
    return NextResponse.json(
      { error: "All fields are required", body },
      { status: 400 }
    );
  }
  return NextResponse.next();
}
