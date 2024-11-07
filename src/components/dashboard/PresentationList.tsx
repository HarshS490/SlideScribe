import { Presentation } from "@prisma/client";
import React, { useEffect, useRef } from "react";
import PresentationCard from "./PresentationCard";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import getPresentations from "@/app/actions/getPresentations";

type Props = {
  presentations: Presentation[] | null;
  updatePresentations: React.Dispatch<
    React.SetStateAction<Presentation[] | null>
  >;
};



function PresentationList({ presentations }: Props) {
  const scrollRef = useRef(null);
  const {data} = useSession();
  useEffect(() => {
    const fetchData = async ()=>{
      if(data?.user?.email){
        const response = await getPresentations();
      }
    }
    fetchData(); 
  }, [data?.user?.email]);

  return (
    <>
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

      {!presentations || presentations.length == 0 ? (
        <div>Presenation creation</div>
      ) : (
        <></>
      )}
    </>
  );
}

export default PresentationList;
