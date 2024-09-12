import { NextRequest, NextResponse } from "next/server";

export async function validateRegister(req: NextRequest) {
  const body = await req.json();
  // const body = req.body;

  // const { email, password, username, name, dateOfBirth, country, state } = body;
  // // ถ้าจะแก้เป็นเหมือนเดิมใช้ body.data
  // // console.log(body);

  // if (
  //   !email ||
  //   !password ||
  //   !username ||
  //   !name ||
  //   !dateOfBirth ||
  //   !country ||
  //   !state
  // ) {
  //   return NextResponse.json(
  //     { error: "All fields are required", body },
  //     { status: 400 }
  //   );
  // }
  return NextResponse.next();
}
