import { NextRequest, NextResponse } from "next/server";

export async function validateRegister(req: NextRequest) {
  // const body = await req.json();
  // const body = req.body;

  // const { email, password, username, name, dateOfBirth, country, state } = body;
  // ถ้าจะแก้เป็นเหมือนเดิมใช้ body.data
  // console.log(body);

  const formData = await req.formData(); // ใช้ formData แทน json

  // ดึงข้อมูลจาก formData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const country = formData.get("country") as string;
  const state = formData.get("state") as string;

  if (
    !email ||
    !password ||
    !username ||
    !name ||
    !dateOfBirth ||
    !country ||
    !state
  ) {
    return NextResponse.json(
      { error: "All fields are required", formData },
      { status: 400 }
    );
  }
  return NextResponse.next();
}
