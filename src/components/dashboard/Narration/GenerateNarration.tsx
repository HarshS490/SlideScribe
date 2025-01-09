import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Presentation } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";


type Props = {
  presentation: Presentation;
};

function GenerateNarration({ presentation }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [narrations, setNarrations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [response,setResponse] = useState<string | null>(null);
  const handleCancel = () => {
    setIsGenerating(false);
  };

  const handleClick = async () => {
    setIsGenerating(true);
    setNarrations([]);
    
    try {
      const dataToSend = {
        url:presentation.link,
        type: presentation.type,
      };
      console.log(dataToSend);

      const res = await fetch("/api/narration",{
        method:"POST",
        body:JSON.stringify(dataToSend),
      });
      
      if(!res || !res.ok || !res.body){
        toast.error("Can't generate Narration");
        console.log(res.body);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      while(true){
        const {value,done} = await reader?.read();
        if(done) break;

        buffer += decoder.decode(value,{stream:true});
        setResponse(buffer);
      }

    } catch (error) {
      console.log(error);
      toast.error("Couldn't generate the narrations");
    }
    finally{
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
        <Button onClick={()=> setResponse("")}>Clear</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {response}

      {isGenerating && (
        <div className="flex justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      )}
    </div>
  );
}

export default GenerateNarration;
