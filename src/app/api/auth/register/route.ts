import multer from "multer";
import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/mongodb";
import bcrypt from "bcrypt";
// import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = multer.memoryStorage();
const multerUpload = multer({ storage: storage });

const multerHandler = multerUpload.fields([{ name: "image", maxCount: 5 }]);

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "merry-match/image-upload",
      type: "private",
    });
    await fs.unlink(filePath); // ลบไฟล์จากเซิร์ฟเวอร์หลังจากอัปโหลดเสร็จ
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return "Cloudinary upload failed";
  }
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>((resolve, reject) => {
    multerHandler(req as any, res as any, async (err: any) => {
      if (err) {
        console.error("Error in file upload:", err);
        res.status(500).json({ message: "Image upload failed" });
        return resolve();
      }

      try {
        await connectMongoDB();

        // console.log("Check request", request.json());
        // const body = await request.json();
        const body = req.body;
        const { name, username, email, password, country, state, dateOfBirth } =
          body.data;
        // console.log("check body", body.data);

        // การอัปโหลดไฟล์
        const avatarFile = (req as any).files?.image;
        let images = null;

        if (avatarFile) {
          const imageArray = [];

          for (const file of avatarFile) {
            const filePath = `/tmp/${file.originalname}`;
            await fs.writeFile(filePath, Buffer.from(file.buffer));

            const uploadResult = await uploadToCloudinary(filePath);

            if (typeof uploadResult === "string") {
              console.error("Failed to upload image:", uploadResult);
              res.status(500).json({ message: "Image upload failed" });
              return resolve();
            }

            const { url, publicId } = uploadResult;
            imageArray.push({ url, publicId });
          }

          images = imageArray; // เก็บอาร์เรย์ของรูปภาพในตัวแปร image
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          res.status(400).json({ message: "Email is already in use." });
          return resolve();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
          name,
          username,
          email,
          password: hashedPassword,
          country,
          state,
          dateOfBirth,
          image: images,
        });

        console.log("User created:", User);

        res.status(201).json({ message: "User registered." });
        return resolve();
      } catch (error: unknown) {
        console.log("Error in POST handler:", error);

        res.status(500).json({ message: "User registered fail" });
        return resolve();
      }
    });
  });
};
