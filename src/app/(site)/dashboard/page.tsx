"use client";
import { PresentationDisplayType } from "@/app/types/presentation";
import PresentationGallery from "@/components/dashboard/PresentationGallery";
import { Presentation } from "@prisma/client";
import React, {useState } from "react";

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
        <main className="w-full  mx-auto ">
          <section className="flex items-center justify-between min-w-max my-4">
            <h1 className="block text-lg sm:text-2xl font-medium min-w-max">
              Your Presentation
            </h1>
            
          </section>

          <PresentationGallery
            presentations={presentations}
            updatePresentations={setPresentations}
            updatePresentationList={addPresentation}
          />
        </main>
      </div>
    </>
  );
};

export default Page;
