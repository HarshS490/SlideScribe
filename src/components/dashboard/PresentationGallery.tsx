import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import getPresentations from "@/app/actions/getPresentations";
import { PresentationDisplayType } from "@/app/types/presentation";
import Loader from "../custom/Loader";
import { Input } from "../ui/input";

import { Calendar, Search, Text } from "lucide-react";
import PresentationList from "./PresentationList";
import { Presentation } from "@prisma/client";
import FileUploadButton from "./FileUploadModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

function PresentationGallery() {
  const [presentations, setPresentations] = useState<
    PresentationDisplayType[] | null
  >(null);

  const scrollRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [SortBy, setSortBy] = useState<string>("Sort By");
  const [query, setQuery] = useState<string>("");

  const appendToPresentation = (newItem: Presentation) => {
    setPresentations((prev) => {
      if (!prev) return [newItem];
      return [...prev, newItem];
    });
  };

  const deletePresentation = (id: string) => {
    setPresentations((prev) => {
      if (!prev) {
        return prev;
      }
      return prev.filter(
        (presentation: PresentationDisplayType) => presentation.id !== id
      );
    });
  };

  const queryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputData = e.target.value;
    setQuery(inputData);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const response = await getPresentations();
      if (isMounted) {
        setPresentations(response);
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [setPresentations, setLoading]);

  if (loading === true) {
    return <Loader />;
  }

  return (
    <>
      <section className="my-6 flex flex-wrap gap-4 justify-between items-center ">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2 lg:w-1/3 flex-shrink flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={queryChange}
            className="text-slate-600 border-gray-400 rounded-sm p-3 pl-10 font-medium placeholder-gray-400 focus:ring-gray-600 focus:border-gray-600 w-full"
            placeholder="Search presentations..."
          />
        </div>

        {/* Sort By Select and File Upload */}
        <div className="relative w-full sm:w-auto flex gap-4 items-center justify-center mx-auto">
          {/* Sort By Select */}
          <div className="w-auto sm:w-28 flex-shrink">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full relative text-sm sm:text-md lg:text-lg text-foreground font-semibold h-10 p-2  flex items-center bg-background dark:bg-secondary border border-border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-all duration-200"
                asChild
              >
                <span className="flex items-center">
                  {SortBy === "Date" ? (
                    <Calendar className="h-4" />
                  ) : (
                    <Text className="h-4" />
                  )}
                  &nbsp;
                  {SortBy}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="bottom"
                className="mt-1 w-auto sm:w-28 z-30 p-1 bg-background dark:bg-secondary border border-border rounded-lg shadow-lg "
              >
                <DropdownMenuItem
                  onClick={() => setSortBy("Date")}
                  className="p-1 cursor-pointer hover:bg-primary/25 rounded-md flex items-center"
                >
                  <Calendar className="h-4 inline-block" />
                  <span>Date</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Title")}
                  className="p-1 cursor-pointer hover:bg-primary/25 rounded-md flex items-center"
                >
                  <Text className="h-4 inline-block" />
                  <span>Title</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* File Upload Button */}
          <div className="w-auto">
            <FileUploadButton updatePresentations={appendToPresentation} />
          </div>
        </div>
      </section>

      <section
        aria-live="polite"
        aria-atomic="true"
        className="my-4 grid justify-items-center lg:grid-cols-4 gap-8 grid-cols-auto-fit-52"
      >
        <PresentationList
          presentations={presentations}
          query={query}
          sortBy={SortBy}
          deletePresentation={deletePresentation}
        />
        {presentations && <div ref={scrollRef}></div>}
      </section>
    </>
  );
}

export default PresentationGallery;
