import axios from "axios";
import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import { SlideContent, SlideNode } from "../types/pptxTypse";
import * as pdfjsLib from "pdfjs-dist";

export const getTextFromPPTX = async (url: string) => {
  try {
    console.log("Starting Extraction ");

    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    const pptxBuffer = Buffer.from(response.data);

    // Load the PPTX file as a ZIP archive
    const zip = await JSZip.loadAsync(pptxBuffer);

    // Extract paths of slide XML files
    const slidePaths: string[] = Object.keys(zip.files).filter(
      (filePath: string) =>
        filePath.startsWith("ppt/slides/slide") && filePath.endsWith(".xml")
    );

    if (slidePaths.length === 0) {
      console.log("No slides found in the PPTX file.");
      return;
    }

    // Extract and parse text content from each slide
    const slidesContent: Record<string, string> = {};
    for (const slidePath of slidePaths) {
      const slideXml = await zip.files[slidePath].async("string");
      const slideData: SlideContent = await parseStringPromise(slideXml);

      const texts: string[] = [];
      const textNodes =
        slideData["p:sld"]?.["p:cSld"]?.[0]?.["p:spTree"]?.[0]?.["p:sp"] || [];
      textNodes.forEach((node: SlideNode) => {
        const textBody = node?.["p:txBody"]?.[0]?.["a:p"];
        if (textBody) {
          textBody.forEach((p) => {
            const textSegments: string[] =
              p["a:r"]
                ?.map((r) => r["a:t"]?.[0] || "") // Provide a fallback empty string
                .filter((text): text is string => Boolean(text)) || []; // Type predicate
            texts.push(...textSegments);
          });
        }
      });

      const slideNumber = slidePath.match(/slide(\d+)\.xml/)?.[1];
      if (slideNumber) {
        slidesContent[slideNumber] = texts.join(" ");
      }
    }

    console.log("Extraction complete");
    return slidesContent;
  } catch (error) {
    console.error("Error parsing the ppt file ", error);
  }
};

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir: string;
  fontName: string;
};

export const getTextFromPDF = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(response.data);

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;

    const slidesContent: Record<string, string> = {};
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Extract and concatenate text content
      const texts: string[] = textContent.items
        .map((item) => {
          const str = (item as TextItem).str; // Explicitly cast to TextItem
          return str || ""; // Provide fallback
        })
        .filter((text): text is string => Boolean(text)); // Type predicate

      // Add the page number as the key and extracted text as the value
      slidesContent[i.toString()] = texts.join(" ");
    }

    // Log the extracted content as JSON
    console.log(JSON.stringify(slidesContent, null, 2));
  } catch (error) {
    console.error("Error extracting text from PDF", error);
  }
};
