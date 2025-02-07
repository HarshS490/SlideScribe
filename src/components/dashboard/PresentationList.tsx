import { PresentationDisplayType } from "@/app/types/presentation";
import React, { useMemo } from "react";
import PresentationCard from "./PresentationCard";

type Props = {
  presentations: PresentationDisplayType[] | null;
  query: string;
  sortBy: string;
  deletePresentation:(id:string)=>void;
};

function PresentationList({ presentations, query, sortBy,deletePresentation }: Props) {
  

  const sortedAndFiltered = useMemo(() => {
    const clonedPresentations = [...(presentations || [])];

    clonedPresentations.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortBy.toLowerCase() == "title") {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    const lowerQuery = query.toLocaleLowerCase();
    
    return clonedPresentations.filter((item) => {
      const title = item.title.toLowerCase();
      return title.includes(lowerQuery);
    });
  }, [sortBy, presentations, query]);

  return (
    <>
      {sortedAndFiltered &&
        sortedAndFiltered.map((presentation) => {
          return (
            <PresentationCard
              presentation={presentation}
              key={presentation.id}
              highlight={query}
              deletePresentation={deletePresentation}
            />
          );
        })}
    </>
  );
}

export default PresentationList;
