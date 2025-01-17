import React, { useState, useEffect } from "react";
import { Presentation } from "@prisma/client";
import { LoaderCircleIcon, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { NarrationForm } from "./NarrationForm";
import { NarrationStyle } from "@/app/types/narration.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

type Props = {
  presentation: Presentation;
};

const GenerateNarration = ({ presentation }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [slideNarrations, setSlideNarrations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rawResponse) {
      const narrationsArray = rawResponse
        .split("<|>")
        .map((text) => text.trim())
        .filter((text) => text.length > 0);
      setSlideNarrations(narrationsArray);
    }
  }, [rawResponse]);

  const handleClear = () => {
    setRawResponse("");
    setSlideNarrations([]);
    setError(null);
  };

  const handleClick = async () => {
    setIsGenerating(true);
    handleClear();

    try {
      const dataToSend = {
        url: presentation.link,
        type: presentation.type,
      };

      const res = await fetch("/api/narration", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });

      if (!res || !res.ok || !res.body) {
        throw new Error("Failed to generate narration");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setRawResponse((prev) => prev + chunk);
      }
    } catch (error) {
      console.error(error);
      setError("Couldn't generate the narrations");
      toast.error("Couldn't generate the narrations");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (data: NarrationStyle) => {
    setIsGenerating(true);
    try {
      const dataToSend = {
        url: presentation.link,
        type: presentation.type,
        narrationStyle: data,
      };

      const res = await fetch("/api/narration/", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });
      
      if(!res || !res.ok || !res.body){
        throw new Error("Error generating narrations!!");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while(true){
        const { value, done } = await reader.read();
        if(done) break;

        const chunk = decoder.decode(value,{stream:true});
        setRawResponse((prev)=>prev+chunk); 
      }
      
    } catch (error) {
      console.error(error);
      setError("Couldn't generate narrations");
      toast.error("Error generating narrations");
    }
    finally{
      setIsGenerating(false);
    }

  };

  return (
    <>
      <div className="relative  bg-gray-100 flex flex-col space-y-6 w-full max-w-4xl mx-auto h-[550px]">
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-2 rounded-lg bg-gray-200 backdrop-blur-sm p-2">
            <TabsTrigger
              value="prompt"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-white p-2"
            >
              Prompt
            </TabsTrigger>
            <TabsTrigger
              value="narrations"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-white p-2"
            >
              Narrations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="prompt">
            <NarrationForm
              isGenerating
              onSubmit={(data: NarrationStyle) => {
                handleClick();
              }}
            />
          </TabsContent>
          <TabsContent value="narrations">
            {slideNarrations.length > 0 && (
              <div className="space-y-4">
                {slideNarrations.map((narration, index) => (
                  <Card key={index} className="bg-white shadow-sm p-2">
                    <CardContent className="prose max-w-none">
                      <Markdown>{narration}</Markdown>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-inherit  overflow-y-auto h-full rounded-lg">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isGenerating && !rawResponse && (
            <div className="flex justify-center py-8">
              <LoaderCircleIcon className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GenerateNarration;
