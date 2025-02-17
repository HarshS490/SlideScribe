import React, { useMemo } from "react";

import PresentationList from "./PresentationList";
import FileUploadButton from "./FileUploadModal";
import SearchInput from "./SearchInput";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

function PresentationGallery() {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";

  const queryKey = useMemo(() => ["Presentations", title], [title]);

  const reFetchNewData = () => {
    queryClient.refetchQueries(queryKey);
  };
  return (
    <>
      <section className="my-6 flex flex-wrap gap-4 justify-between items-center ">
        {/* Search Input */}
        <SearchInput />

        {/* Sort By Select and File Upload */}
        <div className="relative w-full sm:w-auto flex gap-4 items-center justify-center mx-auto">
          {/* Sort By Select */}
          {/* <div className="w-auto sm:w-28 flex-shrink">
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
          </div> */}
          {/* File Upload Button */}
          <div className="w-auto">
            <FileUploadButton updatePresentations={reFetchNewData} />
          </div>
        </div>
      </section>

      <PresentationList />
    </>
  );
}

export default PresentationGallery;
