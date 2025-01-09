import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { extractText, getTextFromPPTX } from "@/app/actions/getTextFromPPT";
import { NextRequest, NextResponse } from "next/server";
import { createDataStreamResponse, generateText, streamText } from "ai";
import { Slide } from "@/app/types/pptxTypse";
import { defaultStyle, NarrationStyle } from "@/app/types/narration.types";
import { model } from "@/providers/genAi";
import { getFileType } from "@/app/helper/getFileType";
import { FileType } from "@/app/types/fileTypes";
import axios from "axios";

function splitIntoBatches(slides: Slide[], batchSize: number) {
  return Array.from({ length: Math.ceil(slides.length / batchSize) }, (_, i) =>
    slides.slice(i * batchSize, (i + 1) * batchSize)
  );
}

function createPrompt(batch: Slide[], style: Partial<NarrationStyle> = {}) {
  const narrationStyle = { ...defaultStyle, ...style };

  const styleGuide = `
    Narration Requirements:
    -Audience : ${narrationStyle.audienceType}
    -Length: ${narrationStyle.duration}
    -Tone: ${narrationStyle.toneStyle}
    -Language: ${narrationStyle.language}
    -Grammar Level: ${narrationStyle.grammarLevel}
    -Flow : ${narrationStyle.presentationFlow} 

    Generate Narrations for each slide with the above requirements:
  `;

  const batchContent = batch
    .map((slide) => {
      return `Slide ${slide.slide}: Content : ${slide.text}`;
    })
    .join("<|>");

  return styleGuide + batchContent;
}

export async function POST(req: NextRequest) {
  try {
    const { url, type } = await req.json();
    if (!url) {
      return NextResponse.json(
        { message: "missing presentation url" },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email || !currentUser.name) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });

    const fileBuffer = Buffer.from(response.data);
    
    const narrationStyle = defaultStyle;
    const result = streamText({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
              Narration Requirements:
              -Audience : ${narrationStyle.audienceType}
              -Length: ${narrationStyle.duration}
              -Tone: ${narrationStyle.toneStyle}
              -Language: ${narrationStyle.language}
              -Grammar Level: ${narrationStyle.grammarLevel}
              -Flow : ${narrationStyle.presentationFlow} 
          
              Generate Narrations for each slide with the above requirements, separate the content of each slide by <|>:
            `,
            },
            {
              type: "file",
              data: fileBuffer,
              mimeType: type,
            },
          ],
        },
      ],
    });
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
