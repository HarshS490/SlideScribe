"use server";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

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

export const uploadFileCloudinary = async (file:File) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return new Promise(async (resolve, reject) => {
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: process.env.CLOUDINARY_FOLDERNAME,
      },
      async (error, res) => {
        if (error) {
          return reject(null);
        }
        return resolve(res);
      }
    ).end(bytes);
  });
  
};

export const deleteFromCloudinary = async (publicId:string)=>{
  if(!publicId) return new Error("publicId of asset not provided");

  const response = await new Promise(async (resolve,reject)=>{
    cloudinary.uploader.destroy(publicId,{resource_type:'raw'},async (error,res)=>{
      if(error){
        return reject(new Error(error.message));
      }
      console.log("asset delete",res);
      return resolve(res);
    })
  });

  return response;
}