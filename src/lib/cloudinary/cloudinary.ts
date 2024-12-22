"use server";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryError } from "./errors";
import { validTypes } from "@/app/types/fileTypes";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (localFilePath: string) => {
  try {
    if (!localFilePath) return new Error("File Path not found");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: process.env.CLOUDINARY_FOLDERNAME,
    });
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error);
    return new Error("Failed to upload file");
  }
};

export const uploadFileCloudinary = async (file: File) => {
  try {
    let format = "";
    if(file.type===validTypes[0]){
      format = "pdf";
    }
    else if(validTypes.includes(file.type)){
      format = "pptx"
    }

    if (!file) throw new CloudinaryError("File not provided");
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise(async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: process.env.CLOUDINARY_FOLDERNAME,
            format:format,
          },
          async (error, res) => {
            if (error) {
              reject(new CloudinaryError(error.message));
            }

            console.log("asset uploaded",res);
            return resolve(res);
          }
        )
        .end(bytes);
    });
  } catch (error) {
    if (error instanceof CloudinaryError) {
      throw error;
    }
    throw new CloudinaryError(
      `Unexpected Error During Upload: ${
        error instanceof Error ? error.message : "Unknown Error"
      }`
    );
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return new CloudinaryError("publicId of asset not provided");

    return new Promise(async (resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "raw" },
        (error, res) => {
          if (error) {
            reject(new CloudinaryError(error.message));
          }
          console.log("asset deleted", res);
          console.log(res);
          resolve(res);
        }
      );
    });
  } catch (error) {
    if (error instanceof CloudinaryError) throw error;

    throw new CloudinaryError(
      `Unexpected Error during upload:${
        error instanceof Error ? error.message : "Unknown Error"
      }`
    );
  }
};
