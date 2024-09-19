import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (filePath: File, folder: string) => {
  const buffer = await filePath.arrayBuffer();
  const byte = Buffer.from(buffer);

  return new Promise<{ url: string; publicId: string }>(
    async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: folder },
          async (err, result) => {
            if (err) {
              return reject(err.message);
            }
            return resolve({
              url: result?.secure_url || "",
              publicId: result?.public_id || "",
            });
          }
        )
        .end(byte);
    }
  );
};
