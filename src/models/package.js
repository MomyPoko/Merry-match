import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema({
  type_package: {
    type: String,
    required: false,
    enum: ["basic", "platinum", "premium"],
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Package ||
  mongoose.model("Package", packageSchema);
