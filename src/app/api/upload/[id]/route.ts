import { pdfThumbnail } from "@/app/helper/pdfThumbnail";
import { pptThumbnails } from "@/app/helper/pptThumbnail";
import { validTypes } from "@/app/types/fileTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const title = data.get("title") as string;
    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing file or title.", success: false },
        { status: 400 }
      );
    }
    const uid = (await params).id;
    if (!uid) {
      return NextResponse.json(
        { error: "Uid missing in request url.", success: false },
        { status: 400 }
      );
    }
    const mimeType = file.type;
     
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // upload the image and file to cloudinary

    // create entry in database.
    
  } catch (error) {}
}
