"use server";
import {fromBuffer} from "pdf2pic"

export async function pdfThumbnail(fileBuffer:Buffer<ArrayBufferLike>){
  const options = {
    density:100,
    format:"png",
    
    preserveAspectRatio: true,
    returnBufferFile: true 
  }
  try {
    const converter = fromBuffer(fileBuffer,options);
    const imageBuffer = await converter(1,{responseType:"buffer"});
    return imageBuffer;
  } catch (error) {
    console.log(error);
    return null;
  } 
}