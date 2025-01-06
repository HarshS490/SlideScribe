import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Presentation } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
import { getTextExtractor } from "@/app/actions/getTextFromPPT";
import { Slide } from "@/app/types/pptxTypse";
import axios from "axios";

type Props = {
  presentation: Presentation;
};

function GenerateNarration({ presentation }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [narrations, setNarrations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<Slide[] | null>(null);
  const textExtractor = useMemo(
    () => getTextExtractor(presentation.type),
    [presentation.type]
  );

  const handleCancel = () => {
    setIsGenerating(false);
  };

  useEffect(() => {
    const extractText = async ()=>{
      const data = await textExtractor(presentation.link);
      data?.sort((a,b)=>{
        return a.slide-b.slide;
      })
      console.log(data);
      setExtractedText(data);
    }
    extractText();
  }, [presentation.link,textExtractor]);

  
  const handleClick =async ()=>{
    setIsGenerating(true);
    setNarrations([]);
    console.log(extractedText);
    try {
      const response = await axios.post("api/narration",{url:presentation.link});
      console.log(response);
    } catch (error) {
      console.log("Error while generating narration ",error);
      setError("Error while generating narration")
    }
    finally{
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex-col items-center justify-center space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleClick}
          disabled={isGenerating || !presentation?.link}
        >
          {isGenerating ? "Generating..." : "Generate Narrations"}
        </Button>
        {isGenerating && (
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {narrations.map((narration, index) => (
          <p key={index} className="p-2 bg-gray-50 rounded">
            {narration}
          </p>
        ))}
      </div>

      {isGenerating && (
        <div className="flex justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      )}
    </div>
  );
}

export default GenerateNarration;
