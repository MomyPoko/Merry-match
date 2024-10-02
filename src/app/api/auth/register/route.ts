import User from "../../../../models/user";
import bcrypt from "bcrypt";
import { connectMongoDB } from "../../../../utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/utils/upload_Files";
import "dotenv/config";

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDB();

    const formData = await req.formData();
    console.log("result check server", formData);

    const name = formData.get("name");
    const email = formData.get("email");
    const username = formData.get("username");
    const password: string | Buffer = formData.get("password") as
      | string
      | Buffer;
    const country = formData.get("country");
    const state = formData.get("state");
    const dateOfBirth = formData.get("dateOfBirth");
    const sexIdent = formData.get("sexIdent");
    const sexPref = formData.get("sexPref");
    const racailPref = formData.get("racailPref");
    const meeting = formData.get("meeting");
    const hobbies = formData.get("hobbies");
    const image = formData.getAll("image") as unknown as File[];

    // แปลงข้อมูล formData ให้เป็น object ที่สามารถใช้งานได้
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // การอัปโหลดไฟล์

    const uploadedImages: { url: string; publicId: string }[] = [];

    for (const image_data of image) {
      const uploadResult = await uploadToCloudinary(
        image_data,
        "merry-match/image-upload"
      );
      uploadedImages.push(uploadResult); // เก็บ URL และ Public ID ของไฟล์ที่อัปโหลดในอาร์เรย์
    }

    data.image = uploadedImages;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use." },
        {
          status: 400,
        }
      );
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
      sexIdent,
      sexPref,
      racailPref,
      meeting,
      hobbies,
      image: uploadedImages,
    });

    // console.log("User created:", User);

    return NextResponse.json(
      { message: "User registered.", data },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("Error in POST handler:", error);

    return NextResponse.json(
      { message: "User registration failed" },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDB(); // เชื่อมต่อ MongoDB

    const users = await User.find(); // ดึงข้อมูลผู้ใช้ทั้งหมด
    return NextResponse.json(users, { status: 200 }); // ส่งข้อมูลกลับ
  } catch (error) {
    console.log("Error fetching users: ", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
