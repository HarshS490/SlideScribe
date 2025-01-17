"use client";
import { EllipsisVertical } from "lucide-react";
import React, { useRef, useState } from "react";
import PdfViewer from "./viewers/PdfViewer";
import { Presentation } from "@prisma/client";
import GenerateNarration from "./Narration/GenerateNarration";
import { validTypes } from "@/app/types/fileTypes";
import PPTViewer from "./viewers/PPTViewer";

type Props = {
  presentation: Presentation | null;
};

function PresentationNarration({ presentation }: Props) {
  const MIN_WIDTH = 250;
  const [columnWidths, setColumnWidths] = useState<Array<number>>([500, 500]);
  const isResizing = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;

    const initialWidths = [...columnWidths];
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const deltaX = e.clientX - startX;
      const newLeftWidth = initialWidths[0] + deltaX;
      const newRightWidth = initialWidths[1] - deltaX;

      // Enforce minimum width for both columns
      if (newLeftWidth >= MIN_WIDTH && newRightWidth >= MIN_WIDTH) {
        setColumnWidths([newLeftWidth, newRightWidth]);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false; // Stop resizing
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="w-full flex justify-center items-stretch gap-1 my-4">
      {/* Left Column */}
      <div
        style={{ width: `${columnWidths[0]}px`, minWidth: `${MIN_WIDTH}px` }}
        className="bg-gray-200 p-4 rounded-lg flex-grow flex-shrink"
      >
        {/* <PdfViewer/> */}
        {presentation?.type === validTypes[0] ? (
          <PdfViewer url={presentation ? presentation.link : ""} />
        ) : (
          <PPTViewer url={presentation ? presentation.link : ""} />
        )}
      </div>

      <div
        className="relative w-2  flex items-center justify-center rounded-full cursor-col-resize transition-all"
        onMouseDown={onMouseDown}
      >
        <EllipsisVertical className="text-slate-400 hover:text-slate-500 active:text-slate-500 absolute" />
      </div>

      <div
        style={{ width: `${columnWidths[1]}px`, minWidth: `${MIN_WIDTH}px` }}
        className="bg-gray-100 p-4 rounded-lg flex-grow flex-shrink "
      >
        {
          presentation && <GenerateNarration presentation={presentation} />
        }
      </div>
    </div>
  );
}

export default PresentationNarration;
