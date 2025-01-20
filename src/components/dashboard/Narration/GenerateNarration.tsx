import React, { useState, useEffect, useRef } from "react";
import { Presentation } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
import { NarrationForm } from "./NarrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Narrations from "./Narrations";

type Props = {
  presentation: Presentation;
};

const GenerateNarration = ({ presentation }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [slideNarrations, setSlideNarrations] = useState<string[]>([]);
  const [tab, setTab] = useState<string>("prompt");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (rawResponse) {
      const narrationsArray = rawResponse
        .split("<|>")
        .map((text) => text.trim())
        .filter((text) => text.length > 0);
      setSlideNarrations(narrationsArray);
    }
  }, [rawResponse]);

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  
  const handleClear=()=>{
    setSlideNarrations([]);
    setRawResponse("");
  }
  return (
    <>
      <div className="relative  bg-gray-100 flex flex-col space-y-6 w-full max-w-4xl mx-auto h-[600px]">
        <Tabs defaultValue="prompt" value={tab} className="w-full h-full">
          <TabsList className="w-full mb-4 grid grid-cols-2 rounded-lg bg-gray-200 backdrop-blur-sm p-2">
            <TabsTrigger
              value="prompt"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-white p-1"
              onClick={() => {
                setTab("prompt");
              }}
            >
              Prompt
            </TabsTrigger>
            <TabsTrigger
              value="narrations"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-white p-1"
              onClick={() => {
                setTab("narrations");
              }}
            >
              Narrations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="h-[530px] w-full">
            <NarrationForm
              ref={formRef}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              presentation={presentation}
              setError={setError}
              setRawResponse={setRawResponse}
              changeTab={setTab}
              handleClear={handleClear}
            />
          </TabsContent>
          <TabsContent value="narrations" className="h-[530px] w-full">
            <Narrations
              setError={setError}
              retry={triggerSubmit}
              slideNarrations={slideNarrations}
              error={error}
              changeTab={setTab}
              isGenerating={isGenerating}
            />
          </TabsContent>
        </Tabs>
        <div className="bg-inherit  overflow-y-auto h-full rounded-lg ">
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
