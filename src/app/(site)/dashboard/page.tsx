"use client";
import { PresentationDisplayType } from "@/app/types/presentation";
import Loader from "@/components/custom/Loader";
import FileUploadButton from "@/components/dashboard/FileUploadModal";
import PresentationList from "@/components/dashboard/PresentationList";
import { Presentation } from "@prisma/client";

import React, { Suspense, useState } from "react";

const Page = () => {
  const [presentations, setPresentations] = useState<
    PresentationDisplayType[] | null
  >(null);

  const addPresentation = (newItem: Presentation) => {
    setPresentations((prev) => {
      if (!prev) return [newItem];
      return [...prev, newItem];
    });
  };
  return (
    <>
      <div className="w-full px-4 my-1">
        <main className="sm:w-11/12 w-full mx-auto ">
          <section className="flex items-center justify-between min-w-max my-4">
            <h1 className="block text-lg sm:text-2xl font-medium min-w-max">
              Your Presentation
            </h1>
            <FileUploadButton updatePresentations={addPresentation} />
          </section>

          <PresentationList
            presentations={presentations}
            updatePresentations={setPresentations}
          />
        </main>
      </div>
    </>
  );
};

export default Page;
