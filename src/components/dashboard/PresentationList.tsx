import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import PresentationCard from "./PresentationCard";
import getPresentations from "@/app/actions/getPresentations";
import { PresentationDisplayType } from "@/app/types/presentation";
import Loader from "../custom/Loader";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

type Props = {
  presentations: PresentationDisplayType[] | null;
  updatePresentations: React.Dispatch<
    React.SetStateAction<PresentationDisplayType[] | null>
  >;
};

function PresentationList({ presentations, updatePresentations }: Props) {
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("date");

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

  const onSelectionChange = (value: string) => {
    setSortBy(value);
  };

  if (loading === true) {
    return <Loader />;
  }

  return (
    <>
      <section className="my-6 grid grid-cols-1  sm:grid-cols-3 gap-2 justify-between ">
        <div className="w-full min-w-48 col-span-2">
          <Input
            className=" text-slate-600 border-gray-400 rounded-sm p-4 font-semibold placeholder-gray-400 focus-visible:ring-gray-600"
            placeholder="Search..."
          />
        </div>
        <div className="w-full col-span-1">
          <Select value={sortBy} onValueChange={onSelectionChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-100 focus:border-cyan-500 focus:ring-cyan-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="title">Sort by Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section
        aria-live="polite"
        aria-atomic="true"
        className="my-4 grid justify-items-center lg:grid-cols-4 gap-8 grid-cols-auto-fit-52"
      >
        {presentations &&
          presentations.map((presentation) => {
            return (
              <PresentationCard
                presentation={presentation}
                key={presentation.id}
              />
            );
          })}
        {presentations && <div ref={scrollRef}></div>}
      </section>
    </>
  );
}

export default PresentationList;
