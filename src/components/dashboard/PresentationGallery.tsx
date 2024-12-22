import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import getPresentations from "@/app/actions/getPresentations";
import { PresentationDisplayType } from "@/app/types/presentation";
import Loader from "../custom/Loader";
import { Input } from "../ui/input";
import { Select, SelectGroup } from "../ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Calendar, Search, Text } from "lucide-react";
import PresentationList from "./PresentationList";
import { Presentation } from "@prisma/client";
import FileUploadButton from "./FileUploadModal";

type Props = {
  presentations: PresentationDisplayType[] | null;
  updatePresentations: React.Dispatch<
    React.SetStateAction<PresentationDisplayType[] | null>
  >;
  updatePresentationList: (newItem: Presentation) => void;
};

function PresentationGallery({
  presentations,
  updatePresentations,
  updatePresentationList,
}: Props) {
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [SortBy, setSortBy] = useState<string>("Sort By");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const response = await getPresentations();
      console.log(response);
      if (isMounted) {
        updatePresentations(response);
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [updatePresentations, setLoading]);

  const queryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputData = e.target.value;
    setQuery(inputData);
  };

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
          <div className="w-auto flex-shrink">
            <Select onValueChange={setSortBy}>
              <SelectTrigger className="relative text-sm sm:text-md lg:text-lg text-gray-600 font-semibold h-10 p-2 w-full sm:w-40 flex items-center bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-all duration-200">
                <span className="flex items-center">
                  {SortBy === "Date" ? (
                    <Calendar className="h-4" />
                  ) : (
                    <Text className="h-4" />
                  )}
                </span>
                <SelectValue placeholder="Sort by" className="ml-2">
                  {SortBy}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="relative w-40 z-30 bg-white rounded-lg shadow-lg border border-gray-200">
                <SelectGroup>
                  {["Date", "Title"].map((option) => (
                    <SelectItem
                      key={option.toLowerCase()}
                      value={option}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2">
                        {option === "Date" ? (
                          <Calendar className="h-4" />
                        ) : (
                          <Text className="h-4" />
                        )}
                        <span>{option}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Button */}
          <div className="w-auto">
            <FileUploadButton updatePresentations={updatePresentationList} />
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
        />
        {presentations && <div ref={scrollRef}></div>}
      </section>
    </>
  );
}

export default PresentationGallery;
