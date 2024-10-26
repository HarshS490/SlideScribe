import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;
    const title = data.get('title') as string; 
    if(!file || !title){
      return NextResponse.json({error:"Missing form data"},{status:400});
    }
    const uid = (await params).id;
    if(!uid){
      return NextResponse.json({error:"Uid missing in request url.",success:false},{status:400});
    } 

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // convert the buffer to image

    // upload the image and file to cloudinary

    // create entry in database.


    
  } catch (error) {
    
  }
}