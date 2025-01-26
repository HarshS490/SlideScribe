import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LoaderCircleIcon,
  MessageCircleQuestionIcon,
  ScrollIcon,
  ScrollText,
  X,
} from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
type Props = {
  slideNarrations: string[];
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  retry: () => void;
  changeTab: React.Dispatch<React.SetStateAction<string>>;
  isGenerating:boolean;
};

function Narrations({
  slideNarrations,
  retry,
  error,
  setError,
  changeTab,
  isGenerating,
}: Props) {
  const onRetry = () => {
    retry();
    setError(null);
  };

  return (
    <>
      <div className="h-full">
        {(slideNarrations.length > 0 || isGenerating)? (
          <div className="h-full overflow-y-auto">
            <div className="space-y-4">
              {slideNarrations.map((narration, index) => {
                const parsedText = narration.replace("<br>","\n");
                return( 
                  <Card key={index} className="bg-white shadow-sm p-2">
                    <CardContent className="max-w-none prose">
                      <Markdown rehypePlugins={[rehypeRaw]}>{parsedText}</Markdown>
                    </CardContent>
                  </Card>)
              })}
            </div>
            {isGenerating && <div className="h-full p-6 flex items-center justify-center">
              <LoaderCircleIcon className="animate-spin"/>
            </div>}
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center bg-white rounded-lg p-6 h-full w-full">
            <div>
              <div className="my-6 flex justify-center">
                <div className="my-6 p-6 relative flex items-center justify-center rounded-full bg-red-400/50">
                  <ScrollIcon className="size-20 " />
                  <X className="ml-1 mb-1 absolute size-6 bg-red-500 rounded-full p-1 text-white " />
                </div>
              </div>
              <div className="my-6 px-5 flex flex-col items-center">
                <div className="text-red-500 font-semibold text-center">
                  <X className="inline align-middle size-5 mr-2" />
                  <span className="align-top text-lg">
                    Unable to Generate Narrations
                  </span>
                </div>
                <div className=" my-4">
                  <p className="text-gray-500 text-center leading-tight">
                    We couldn&lsquo;t generate the narration at this time. This
                    might be due to a temporary issue. Please try again in a few
                    moments.
                  </p>
                </div>
                <Button
                  variant={"outline"}
                  className="border-cyan"
                  onClick={onRetry}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        ) : (
          
          <div className="flex flex-col justify-center gap-2 bg-white rounded-lg p-6 h-full">
            
            <div className="my-6 flex justify-center">
              <div className="p-6 relative items-center justify-center rounded-full bg-cyan-800/50">
                <ScrollText className="size-20 text-slate-800" />
                <MessageCircleQuestionIcon className="absolute top-1/4 right-2 size-7 text-slate-800" />
              </div>
            </div>
            <div className="my-5 px-5 flex flex-col items-center">
              <div className="text-slate-700 font-semibold text-center">
                <span className="align-top text-lg font-bold">
                  No Narrations Available
                </span>
              </div>
              <div className=" my-4">
                <p className="text-gray-500 text-center leading-tight">
                  No narrations were generated for this presentation.
                </p>
                <p className="mt-4 text-slate-700 text-center font-semibold">
                  Would you like to Generate?
                </p>
              </div>
              <Button
                variant={"outline"}
                className="border-cyan-800 hover:bg-cyan-700/70 text-slate-800 font-semibold text-lg  transition-colors"
                onClick={() => changeTab("prompt")}
              >
                Generate
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Narrations;
