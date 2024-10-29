import { getCurrentUser } from "@/app/actions/getCurrentUse";
import { validTypes } from "@/app/types/fileTypes";
import { deleteFromCloudinary, uploadFileCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST")
      return NextResponse.json(
        { error: "Method not allowed", success: false },
        { status: 405 }
      );
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser?.id || !currentUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized", sucess: false },
        { status: 401 }
      );
    }

    const data = await req.formData();
    const file = data.get("file") as File | null;
    const title = data.get("title") as string;
    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing file or title.", success: false },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid file type", success: false },
        { status: 400 }
      );
    }
   
    // upload the image and file to cloudinary
    const response = await uploadFileCloudinary(file);
    if (!response) {
      return NextResponse.json(
        { error: "Error uploading file to cloudinary", sucess: false },
        { status: 500 }
      );
    }
    //@ts-expect-error cloudinary api upload
    const { secure_url, public_id } = response;
    if (!secure_url || !public_id) {
      return NextResponse.json(
        { error: "Error uploading file to cloudinary", success: false },
        { status: 500 }
      );
    }
    // create entry in database.

    const newPresentation = await prisma.presentation.create({
      data: {
        link: secure_url,
        public_id: public_id,
        title: title,
        type: mimeType,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
    if (!newPresentation) {
      await deleteFromCloudinary(public_id);
      return NextResponse.json(
        { error: "Error creating presentation in database", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: newPresentation, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
