import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  try {
    await connectMongoDB();

    // console.log("Check request", request.json());
    const body = await request.json();
    const { name, username, email, password, country, state, dateOfBirth } =
      body.data;
    // console.log("check body", body.data);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email is already in use.", { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      country,
      state,
      dateOfBirth,
    });
    console.log("User created:", User);

    return new NextResponse("User registered.", { status: 201 });
  } catch (error: unknown) {
    console.log("Error in POST handler:", error);
    return NextResponse.json(
      { message: "User registered fail" },
      {
        status: 500,
      }
    );
  }
};
