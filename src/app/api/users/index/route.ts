import User from "@/models/user";
// import Package from "@/models/package";
import { connectMongoDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";
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

export const GET = async () => {
  try {
    await connectMongoDB();

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
