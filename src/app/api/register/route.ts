import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request:NextRequest){
  try {
    const body =await request.json();
    const {username,email,password} = body;
    if(!email || !username || !password){
      return new NextResponse("Missing Info",{status:400});
    }

    const user = await prisma.user.findUnique({
      where:{
        email:email
      }
    });

    if(user){
      return new NextResponse("User Already exists",{status:400});
    }
    const hashedPass = await bcrypt.hash(password,12);
    const newUser = await prisma.user.create({
      data:{
        email:email,
        name:username,
        password:hashedPass,
      }
    });

    return NextResponse.json({message:"userCreated",data:newUser});
  } catch (error) {
    console.log(error,"error occured while registering");
    return new NextResponse("Internal Server Error",{status:500});
  }
}