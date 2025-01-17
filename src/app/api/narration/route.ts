import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { defaultStyle } from "@/app/types/narration.types";
import { model } from "@/providers/genAi";
import axios from "axios";

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
      maxSteps: 2,
      experimental_continueSteps: true,
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
              - Include an Introductory slide from the POV of user 
              - Separate the slide No. title from the slide narration by new line.
              - Use Markdown for styling and emphasis.
              - Give detailed description in narration if possible give examples separate them from remaining narration by newline and hight light them.
              Generate Narrations for each slide with the above requirements, put <|> at starting and ending of each slide:
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
