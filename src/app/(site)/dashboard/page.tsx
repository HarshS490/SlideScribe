import FileUploadButton from "@/components/custom/FileUploadModal";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const page = async () => {
  return (
    <>
      
      <div className="w-full px-4 my-1">
        <main className="sm:w-11/12 w-full mx-auto ">
          <section className="flex items-center justify-between min-w-max my-4">
            <h1 className="block text-lg sm:text-2xl font-medium min-w-max">
              Your Presentation
            </h1>
            <FileUploadButton/>
          </section>
          <section
            aria-live="polite"
            aria-atomic="true"
            className="my-4 grid justify-items-center lg:grid-cols-4 gap-4 grid-cols-auto-fit-52"
          >
            <Card
              className="w-full min-w-52 max-w-96 focus:focus-within:outline-none focus:ring-1  focus:ring-cyan-600 cursor-pointer"
              aria-label="Presentation"
              tabIndex={0}
            >
              <CardContent className="overflow-hidden rounded-lg flex-col items-center p-2 hover:bg-gray-100 transition-colors ">
                <div className="w-full relative h-36 bg-white rounded-lg overflow-hidden group">
                  <Image
                    src="/pdf.svg"
                    className="w-auto h-auto mx-auto object-cover group-hover:scale-105 transition-all "
                    alt="Presentation thumbnail"
                    draggable="false"
                    fill={true}
                    sizes="(max-width:200px) 70vw,(max-width:1200px) 33vw"
                  />
                  <div className="-z-20 relative w-full h-full group-hover:z-20 focus-within:z-20  group-hover:bg-slate-400/50 transition-all ease-in-out  ">
                    <Link
                      href={`/dashboard/#`}
                      aria-label="Open the presentation"
                      className="absolute top-1 right-1 focus:outline-none "
                      tabIndex={0}
                    >
                      <ExternalLink className="stroke-cyan-800  hover:stroke-cyan-900"></ExternalLink>
                    </Link>
                  </div>
                </div>
                <h2 className="text-lg font-medium my-2">{"Title"}</h2>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default page;
