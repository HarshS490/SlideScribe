"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUse";

const getPresentations = async ()=>{
  try {
    const user =await getCurrentUser();
    if(!user?.id){
      return [];
    }
    const presentation = await prisma.presentation.findMany({
      orderBy:{
        createdAt:"desc",
      },
      where:{
        userId: user.id
      },
    });

    return presentation;

  } catch (error) {
    console.log(error);
    return [];
  }

}

export default getPresentations;