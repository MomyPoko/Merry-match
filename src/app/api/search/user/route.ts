import User from "@/models/user";
// import Package from "@/models/package";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("strictPopulate", false);

const getAllUsersWithPackage = async () => {
  const users = await User.find().populate("packages").lean();

  return users.map((user) => ({
    ...user,
    packages: user.packages || null, // ถ้าไม่มี package ให้ตั้งค่าเป็น null
  }));
};

const getUserByKeyValue = async (key: any) => {
  const user = await User.findOne({
    $or: [{ name: key }, { username: key }],
  })
    .populate("packages")
    .lean();

  return user || null; // ถ้าไม่พบผู้ใช้ให้คืนค่า null
};

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("name") || searchParams.get("username");

    if (key) {
      const user = await getUserByKeyValue(key);
      if (user) {
        return NextResponse.json(user, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    }

    const usersWithPackage = await getAllUsersWithPackage();

    return NextResponse.json(usersWithPackage, { status: 200 });
  } catch (error) {
    console.log("Error fetching users: ", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
