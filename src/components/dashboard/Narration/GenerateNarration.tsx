import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Presentation } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
import axios from "axios";

type Props = {
  presentation: Presentation;
};

function GenerateNarration({ presentation }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [narrations, setNarrations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    setIsGenerating(false);
  };

  const handleClick = async () => {
    setIsGenerating(true);
    setNarrations([]);
    try {
      const response = await axios.post("api/narration", {
        url: presentation.link,
      });
      console.log(response);
    } catch (error) {
      console.log("Error while generating narration ", error);
      setError("Error while generating narration");
    } finally {
      setIsGenerating(false);
    }
  };

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
