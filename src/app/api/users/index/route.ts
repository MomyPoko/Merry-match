import User from "@/models/user";
// import user from "@/models/user";
import mongoose from "mongoose";
import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import "dotenv/config";

mongoose.set("strictPopulate", false);

const getAllUsersWithPackage = async (currentUserId: string) => {
  const users = await User.find({
    _id: { $ne: currentUserId },
    rejectedUsers: { $nin: [currentUserId] },
  })
    .populate("packages")
    .lean();

  // console.log("check user add rejected: ", users);
  return users.map((user) => ({
    ...user,
    packages: user.packages || null, // ถ้าไม่มี package ให้ตั้งค่าเป็น null
  }));
};

const getUserByKeyValue = async (
  sexIdent?: string | null,
  minAge?: number | null,
  maxAge?: number | null,
  currentUserId?: string
) => {
  const query: any = {
    _id: { $ne: currentUserId },
    rejectedUsers: { $nin: [currentUserId] },
  };

  if (sexIdent) {
    const sexIdentArray = sexIdent.split(",");
    query.sexIdent = { $in: sexIdentArray };
  }

  if (minAge != null && maxAge != null) {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - maxAge - 1,
      today.getMonth(),
      today.getDate() + 1
    );
    const maxDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    );

    query.dateOfBirth = { $gte: minDate, $lte: maxDate };
  }

  const user = await User.find(query).populate("packages").lean();

  return user || null; // ถ้าไม่พบผู้ใช้ให้คืนค่า null
};

export async function GET(req: NextRequest) {
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
    const sexIdent = searchParams.get("sexIdent");
    const minAge = searchParams.get("minAge")
      ? parseInt(searchParams.get("minAge") || "0", 10)
      : null;
    const maxAge = searchParams.get("maxAge")
      ? parseInt(searchParams.get("maxAge") || "0", 10)
      : null;

    // ถ้ามี params_key ให้ค้นหาผู้ใช้โดยใช้ sexIdent หรือ dateofbirth
    if (sexIdent || (minAge !== null && maxAge !== null)) {
      const user = await getUserByKeyValue(
        sexIdent,
        minAge,
        maxAge,
        currentUserId
      );
      if (user && user.length > 0) {
        return NextResponse.json(user, { status: 200 });
      } else {
        // ส่ง array ว่างถ้าไม่พบผู้ใช้
        return NextResponse.json([], { status: 200 });
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
}

export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received");
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    // console.log("check session data: ", session);
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { rejectedUserId } = await req.json();
    const currentUserId = session.user.id;

    console.log("currentUserId: ", currentUserId);
    console.log("rejectedUserId: ", rejectedUserId);

    const currentUser = await User.findById(currentUserId);
    if (!currentUser.rejectedUsers.includes(rejectedUserId)) {
      console.log("Before rejecting: ", currentUser.rejectedUsers);
      currentUser.rejectedUsers.push(rejectedUserId); // เพิ่ม ID ผู้ใช้ที่ถูกปฏิเสธ
      await currentUser.save();
      console.log("After rejecting: ", currentUser.rejectedUsers);
    }

    return NextResponse.json(
      { message: "User rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error rejecting user: ", error);
    return NextResponse.json(
      { message: "Failed to reject user" },
      { status: 500 }
    );
  }
}
