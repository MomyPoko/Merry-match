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
    },
    receiverUser: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "matched", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true, collection: "matching" }
);

export default mongoose.models.MatchingStatus ||
  mongoose.model("MatchingStatus", matchingSchema);
