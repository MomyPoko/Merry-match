import User from "@/models/user";
// import Package from "@/models/package";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("strictPopulate", false);

const getAllUsersWithPackage = async (currentUserId: string) => {
  const users = await User.find({ _id: { $ne: currentUserId } })
    .populate("packages")
    .lean();

  return users.map((user) => ({
    ...user,
    packages: user.packages || null, // ถ้าไม่มี package ให้ตั้งค่าเป็น null
  }));
};

const getUserByKeyValue = async (
  sexPref?: string | null,
  dateOfBirth?: string | null,
  currentUserId?: string
) => {
  const query: any = {
    _id: { $ne: currentUserId },
  };

  if (sexPref) {
    query.sexPref = sexPref;
  }

  if (dateOfBirth) {
    query.dateOfBirth = dateOfBirth;
  }

  const user = await User.find(query).populate("packages").lean();

  return user || null; // ถ้าไม่พบผู้ใช้ให้คืนค่า null
};

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id;

    const { searchParams } = new URL(req.url);
    const sexpref = searchParams.get("sexPref");
    const dateofbirth = searchParams.get("dateOfBirth");

    // ถ้ามี params_key ให้ค้นหาผู้ใช้โดยใช้ sexpref หรือ dateofbirth
    if (sexpref || dateofbirth) {
      const user = await getUserByKeyValue(sexpref, dateofbirth, currentUserId);
      if (user.length > 0) {
        return NextResponse.json(user, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
    } else {
      // ถ้าไม่มี params_key ให้คืนค่าผู้ใช้ทั้งหมดพร้อม package
      const usersWithPackage = await getAllUsersWithPackage(currentUserId);
      return NextResponse.json(usersWithPackage, { status: 200 });
    }
  } catch (error) {
    console.log("Error fetching users: ", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
