import multer from "multer";
import User from "../../../../models/user";
import { connectMongoDB } from "../../../../utils/mongodb";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import "dotenv/config";
import { IncomingForm } from "formidable";

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
    // console.log("baby momo");
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

export const POST = async (req: any) => {
  // const body = {};
  // result.forEach((result, index_result) => {
  //   body[index_result] = result;
  // });

  return new Promise<Response>((resolve, reject) => {
    multerHandler(req as any, {} as any, async (err: any) => {
      if (err) {
        console.error("Error in file upload:", err);
        return resolve(
          new Response(JSON.stringify({ message: "Image upload failed" }), {
            status: 500,
          })
        );
      }

      const formData = await req.formData();
      console.log("result check", formData);

      const name = formData.get("name");
      const email = formData.get("email");
      const username = formData.get("username");
      const password: string | Buffer = formData.get("password") as
        | string
        | Buffer;
      const country = formData.get("country");
      const state = formData.get("state");
      const dateOfBirth = formData.get("dateOfBirth");

      // if (!password) {
      //   return Response.json({ message: "I need password" });
      // }

      // const name = (req as any).body.name;
      // const email = (req as any).body.email;
      // const username = (req as any).body.username;
      // const password: string | null = (req as any).body.password;
      // const country = (req as any).body.country;
      // const state = (req as any).body.state;
      // const dateOfBirth = (req as any).body.dateOfBirth;
      // console.log(name);

      try {
        await connectMongoDB();
        // console.log("Check request", request.json());
        // const body = await req.json();
        // const body = result as any as UserRegistrationBody;

        // console.log("check body", body);

        // การอัปโหลดไฟล์
        const avatarFile = (req as any).files;
        console.log("check avatar file", avatarFile);
        let images = null;

        if (avatarFile) {
          const imageArray = [];

          for (const file of avatarFile) {
            const filePath = `/tmp/${file.originalname}`;
            console.log(filePath);
            await fs.writeFile(filePath, Buffer.from(file.buffer));

            const uploadResult = await uploadToCloudinary(filePath);

            if (typeof uploadResult === "string") {
              console.error("Failed to upload image:", uploadResult);
              return resolve(
                new Response(
                  JSON.stringify({ message: "Image upload failed" }),
                  { status: 500 }
                )
              );
            }

            const { url, publicId } = uploadResult;
            imageArray.push({ url, publicId });
          }

          images = imageArray; // เก็บอาร์เรย์ของรูปภาพในตัวแปร image
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return resolve(
            new Response(
              JSON.stringify({ message: "Email is already in use." }),
              { status: 400 }
            )
          );
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

        // console.log("User created:", User);

        return resolve(
          new Response(JSON.stringify({ message: "User registered." }), {
            status: 201,
          })
        );
      } catch (error: unknown) {
        console.log("Error in POST handler:", error);

        return resolve(
          new Response(
            JSON.stringify({ message: "User registration failed" }),
            { status: 500 }
          )
        );
      }
    });
  });
};
