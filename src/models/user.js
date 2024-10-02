import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    sexIdent: {
      type: String,
      require: false,
    },
    sexPref: {
      type: String,
      require: false,
    },
    recailPref: {
      type: String,
      require: false,
    },
    meeting: {
      type: String,
      require: false,
    },
    hobbies: {
      type: String,
      require: false,
    },
    image: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    role: {
      type: String,
      required: false,
      default: "user",
    },
  },
  { timestampsz: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
