// import axios from "axios";
import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import { Slide, SlideContent, SlideNode } from "../types/pptxTypse";
import { FileType } from "../types/fileTypes";
import { getFileType } from "../helper/getFileType";

export const getTextFromPPTX = async (pptxBuffer:Buffer) => {
  try {
    console.log("Starting Extraction ");

    // const response = await axios.get<ArrayBuffer>(url, {
    //   responseType: "arraybuffer",
    // });
    // const pptxBuffer = Buffer.from(response.data);

    // Load the PPTX file as a ZIP archive
    const zip = await JSZip.loadAsync(pptxBuffer);

    // Extract paths of slide XML files
    const slidePaths: string[] = Object.keys(zip.files).filter(
      (filePath: string) =>
        filePath.startsWith("ppt/slides/slide") && filePath.endsWith(".xml")
    );

    if (slidePaths.length === 0) {
      console.log("No slides found in the PPTX file.");
      return null;
    }

    // Extract and parse text content from each slide
    const slidesContent: Slide[] = [];
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
        slidesContent.push({
          slide: parseInt(slideNumber),
          text: texts.join(""),
        });
      }
    }

    console.log("Extraction complete");
    return slidesContent;
  } catch (error) {
    console.error("Error parsing the ppt file ", error);
    return null;
  }
};

// export const getTextFromPDF = async (url: string): Promise<Slide[] | null> => {
//   try {
//     const response = await axios.get(url, { responseType: "arraybuffer" });
//     // const pdfBuffer = Buffer.from(response.data);
//     const pdfUint8Array = new Uint8Array(response.data);

//     // Load the PDF document
//     const pdf = await pdfjsLib.getDocument({ data: pdfUint8Array }).promise;

//     const slidesContent: Slide[] = [];
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();

//       // Extract and concatenate text content
//       const texts: string[] = textContent.items
//         .map((item) => {
//           const str = (item as TextItem).str;
//           return str || "";
//         })
//         .filter((text): text is string => Boolean(text));

//       slidesContent.push({
//         slide: i,
//         text: texts.join(" "),
//       });
//     }

//     return slidesContent;
//   } catch (error) {
//     console.error("Error extracting text from PDF", error);
//     return null;
//   }
// };



export const extractText =async (type: string,fileBuffer:Buffer) => {
  const fileType: FileType = getFileType(type);
  console.log(fileType);
  return await getTextFromPPTX(fileBuffer);
};

export const tempFunc = ()=>{
  console.log("test function");
}