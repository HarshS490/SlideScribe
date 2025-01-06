"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusSquare, PlusSquareIcon } from "lucide-react";
import { useState, useRef } from "react";
import { pdfjs,Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import DocumentLoader from "../DocumentLoader";
import DocumentLoadError from "../DocumentLoadError";
// import { setUpPdfWorker } from "@/utils/pdfUtils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const maxWidth = 800;

type Props = {
  url: string;
};

export default function PdfViewer({ url }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, numPages);
      if (pageRefs.current[nextPage - 1] && containerRef.current) {
        pageRefs.current[nextPage - 1]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return nextPage;
    });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const pageHeight =
        pageRefs.current[0]?.getBoundingClientRect().height ?? 0;
      const currentPage = Math.floor(scrollTop / pageHeight) + 1;
      setCurrentPage(currentPage);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => {
      const prevPage = Math.max(prev - 1, 1);
      if (pageRefs.current[prevPage - 1] && containerRef.current) {
        pageRefs.current[prevPage - 1]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return prevPage;
    });
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const zoomIn = () => {
    setZoom((prev) => {
      if (prev != 1.5) {
        return prev + 0.25;
      } else {
        return prev;
      }
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      if (prev != 0.5) {
        return prev - 0.25;
      } else {
        return prev;
      }
    });
  };

  // useEffect(()=>{
  //   setUpPdfWorker();
  // },[]);

  return (
    <>
      <div className="Example relative group flex-col items-center">
        <div
          ref={containerRef}
          className="overflow-scroll h-[550px] rounded-md flex-col items-center"
          onScroll={handleScroll}
        >
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading={<DocumentLoader/>} error={<DocumentLoadError message="Error Loading Pdf File"/>}>
            {Array.from(new Array(numPages), (_el, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el :HTMLDivElement | null) => {pageRefs.current[index] = el}}
              >
                <Page scale={zoom} pageNumber={index + 1} width={maxWidth} loading={<DocumentLoader/>} className={"flex justify-center"}/>
              </div>
            ))}
          </Document>
        </div>
        <div className="w-full flex justify-center absolute  bottom-20 z-30 opacity-0 group-hover:opacity-100 transition-opacity ">
          <div className="w-auto flex justify-stretch gap-2 items-center bg-cyan-700/80 hover:bg-cyan-700/85 rounded-lg ">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer hover:bg-cyan-400/80"
              onClick={zoomOut}
            >
              <MinusSquare className="text-slate-800" />
            </Button>
            <span className="block text-white font-semibold">
              {Math.floor(zoom * 100)}%
            </span>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer hover:bg-cyan-400/80"
              onClick={zoomIn}
            >
              <PlusSquareIcon className="text-slate-800" />
            </Button>
          </div>
        </div>
        <div className="navigation w-auto flex justify-center items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <div>
            <span className="font-semibold">
              Page &nbsp;
              <Input
                value={currentPage}
                onChange={(e)=>{
                  const val:number = parseInt(e.target.value,10);
                  setCurrentPage(val);
                }}
                className="w-7 p-0 inline outline-gray-50 h-7 bg-gray-100 "
              />
              &nbsp;of {numPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
