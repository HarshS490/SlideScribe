import { PresentationDisplayType } from "@/app/types/presentation";
import React, { useMemo } from "react";
import PresentationCard from "./PresentationCard";

type Props = {
  presentations: PresentationDisplayType[] | null;
  query: string;
  sortBy: string;
};

function PresentationList({ presentations, query, sortBy }: Props) {
  const sortedAndFiltered = useMemo(() => {
    const clonedPresentations = [...(presentations || [])];

    clonedPresentations.sort((a, b) => {
      if (sortBy.toLowerCase() == "title") {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

    const lowerQuery = query;
    lowerQuery.toLowerCase();
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
            />
          );
        })}
    </>
  );
}

export default PresentationList;
