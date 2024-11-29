import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import MatchingStatus from "@/models/matching";

interface UpdateMatchingRequest {
  updateStatus: "matched" | "rejected";
  receiverId: string;
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectMongoDB();

    // ประกาศตัวแปล matchingId เพื่อเก็บข้อมูลหลังจากมีการกด match จาก id ใน collection matching
    const matchingId = params.id;

    // ประกาศตัวแปล status
    const { updateStatus, receiverId }: UpdateMatchingRequest =
      await req.json();

    const matching = await MatchingStatus.findById(matchingId);
    // console.log("Matching found: ", matching);

    if (!matching) {
      return NextResponse.json(
        { message: "Matching status not found" },
        { status: 404 }
      );
    }

    const receiver = matching.receiverUser.find(
      (user: any) => user.id.toString() === receiverId
    );

    console.log("Receiver ID: ", receiverId);

    if (!receiver) {
      return NextResponse.json(
        {
          message: "Receiver user not found in matching status",
        },
        { status: 404 }
      );
    }

    receiver.status = updateStatus;
    await matching.save();

    return NextResponse.json(
      { message: "Matching status updated successfully", matching },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating matching status: ", error);
    return NextResponse.json(
      { message: "Failed to update matching status" },
      { status: 500 }
    );
  }
};
