import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import MatchingStatus from "@/models/matching";
import User from "@/models/user";

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDB();
    const { requesterUser, receiverUser } = await req.json();

    const requester = await User.findById(requesterUser.id);
    const receiver = await User.findById(receiverUser.id);

    // console.log("show requester", requester);
    // console.log("show receiver", receiver);

    if (!requester || !receiver) {
      return NextResponse.json(
        { message: "Requester or Receiver not found" },
        { status: 404 }
      );
    }

    const newMatching = new MatchingStatus({
      requesterUser: {
        id: requester._id,
        username: requester.username,
      },
      receiverUser: {
        id: receiver._id,
        username: receiver.username,
      },
      status: "pending",
    });

    await newMatching.save();

    return NextResponse.json(
      {
        message: "Matching request created successfully",
        matchingDetails: {
          requester: {
            id: requester._id,
            username: requester.username,
          },
          receiver: {
            id: receiver._id,
            username: receiver.username,
          },
          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating matching request: ", error);
    return NextResponse.json(
      { message: "Failed to create matching request" },
      { status: 500 }
    );
  }
};
