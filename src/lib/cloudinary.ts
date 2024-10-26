"use server";
import fs from "fs";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
  cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
}) 


export const uploadOnCloudinary = async (localFilePath:string)=>{
  try {
    if(!localFilePath) return new Error("File Path not found");
    
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto",
      folder:process.env.CLOUDINARY_FOLDERNAME
    })
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error);
    return new Error("Failed to upload file");
  }
}
