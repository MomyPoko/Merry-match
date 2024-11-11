import mongoose, { Schema } from "mongoose";
import User from "@/models/user";

const matchingSchema = new Schema(
  {
    requesterUser: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: [
        {
          url: { type: String },
          publicId: { type: String },
        },
      ],
    },
    receiverUser: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: [
          {
            url: { type: String },
            publicId: { type: String },
          },
        ],
        status: {
          type: String,
          enum: ["pending", "matched", "rejected"],
          default: "pending",
          required: true,
        },
      },
    ],
  },
  { timestamps: true, collection: "matching" }
);

export default mongoose.models.MatchingStatus ||
  mongoose.model("MatchingStatus", matchingSchema);
