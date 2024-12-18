import { connectMongoDB } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import MatchingStatus from "@/models/matching";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { requesterUser, receiverUser } = await req.json();

    const requester = await User.findById(requesterUser.id);
    const receiver = await User.findById(receiverUser.id);

    if (!requester || !receiver) {
      return NextResponse.json(
        { message: "Requester or Receiver not found" },
        { status: 404 }
      );
    }

    let existingMatching = await MatchingStatus.findOne({
      "requesterUser.id": requester._id,
    });

    if (existingMatching) {
      const receiverExists = existingMatching.receiverUser.some(
        (user: any) => user.id.toString() === receiver._id.toString()
      );

      if (!receiverExists) {
        existingMatching.receiverUser.push({
          id: receiver._id,
          username: receiver.username,
          name: receiver.name,
          image: receiver.image,
          status: "pending",
        });
        await existingMatching.save();
      }
      return NextResponse.json(
        {
          message: "Matching updated with new receiver",
          matching_data: existingMatching,
        },
        { status: 200 }
      );
    } else {
      const newMatching = new MatchingStatus({
        requesterUser: {
          id: requester._id,
          username: requester.username,
          name: requester.name,
          dateOfBirth: requester.dateOfBirth,
          country: requester.country,
          state: requester.state,
          sexPref: requester.sexPref,
          sexIdent: requester.sexIdent,
          racialPref: requester.racialPref,
          meeting: requester.meeting,
          hobbies: requester.hobbies,
          image: requester.image,
        },
        receiverUser: [
          {
            id: receiver._id,
            username: receiver.username,
            name: receiver.name,
            image: receiver.image,
            status: "pending",
          },
        ],
      });

      await newMatching.save();

      return NextResponse.json(
        {
          message: "Matching request created successfully",
          matching_data: newMatching,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("Error creating matching request: ", error);
    return NextResponse.json(
      { message: "Failed to create matching request" },
      { status: 500 }
    );
  }
}

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

    const sentRequests = await MatchingStatus.find({
      "requesterUser.id": currentUserId,
    });

    const receivedRequests = await MatchingStatus.find({
      "receiverUser.id": currentUserId,
    }).sort({ updatedAt: -1 });

    console.log("Matching get data sentRequests: ", sentRequests);
    console.log("Matching get data receivedRequests: ", receivedRequests);
    return NextResponse.json(
      { sentRequests, receivedRequests },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching matching data: ", error);
    return NextResponse.json(
      {
        message: "Failed to fetch matching data",
        error,
      },
      { status: 500 }
    );
  }
}
