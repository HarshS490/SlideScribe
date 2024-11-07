import React, { useRef } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PresentationDisplayType } from "@/app/types/presentation";
import { getFileIcon } from "@/app/helper/fileToIcon";

type Props = {
  presentation: PresentationDisplayType;
};

const PresentationCard = ({ presentation }: Props) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (linkRef.current && linkRef.current !== event.target) {
      linkRef.current.click();
    }
  };
  return (
    <Card
      className="w-full h-full min-w-52 max-w-96 focus:focus-within:outline-none focus:ring-1   focus:ring-cyan-600 cursor-pointer"
      aria-label="Presentation"
      tabIndex={0}
      onClick={handleParentClick}
    >
      <CardContent className="h-full overflow-hidden rounded-lg flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 transition-all">
        <div className="w-full relative h-44  bg-white rounded-lg overflow-hidden group">
          <Image
            src={getFileIcon(presentation.type)}
            className=" w-auto h-auto mx-auto object-cover group-hover:scale-105 transition-all"
            alt="Presentation thumbnail"
            draggable="false"
            fill={true}
            sizes="(max-width:200px) 70vw,(max-width:1200px) 33vw"
          />
          <div className="-z-20 group-hover:z-10 focus-within:z-10 relative w-full h-full transition-all  bg-slate-400/50 ">
            <Link
              href={`/dashboard/${presentation.id}`}
              aria-label="Open the presentation"
              className="absolute top-1 right-1 focus:outline-none "
              tabIndex={0}
              ref={linkRef}
            >
              <ExternalLink className="stroke-cyan-800 hover:stroke-cyan-900"></ExternalLink>
            </Link>
          </div>
        </div>
        <h2 className="text-lg font-medium my-2 text-slate-700 px-2">{presentation.title}</h2>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
