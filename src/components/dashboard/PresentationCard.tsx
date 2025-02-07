"use client";
import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Ellipsis, ExternalLink, Trash } from "lucide-react";
import { PresentationDisplayType } from "@/app/types/presentation";
import { getFileIcon } from "@/app/helper/fileToIcon";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

type Props = {
  presentation: PresentationDisplayType;
  highlight: string;
  deletePresentation: (id: string) => void;
};

const PresentationCard = ({
  presentation,
  highlight,
  deletePresentation,
}: Props) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const linkRef = useRef<HTMLAnchorElement>(null);
  const imageLink = useMemo(() => {
    const modifiedLink = presentation.link.replace(".pdf", ".png");
    return modifiedLink;
  }, [presentation]);
  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (linkRef.current && linkRef.current !== event.target) {
      linkRef.current.click();
    }
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const deleteHandler = async () => {
    try {
      const response = await fetch("api/file/delete", {
        method: "DELETE",
        body: JSON.stringify({ pid: presentation.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        deletePresentation(presentation.id);
        toast.success("Deleted");
      } else {
        throw new Error("Couldn't delete the file");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("unknown error occured");
      }
    }
  };

  return (
    <Card
      className="w-full h-full min-w-52 max-w-96 focus:focus-within:outline-none focus:ring-1   focus:ring-cyan-600 focus-whitin:border focus-within:border-cyan-600 cursor-pointer group/container"
      aria-label="Presentation"
      tabIndex={0}
      onClick={handleParentClick}
    >
      <CardContent className="h-full overflow-hidden rounded-lg flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 transition-all">
        <div className="w-full relative h-44  bg-white rounded-lg overflow-hidden ">
          <Skeleton className={clsx(isImageLoading?"w-full h-full bg-gray-300":"hidden")} />
            <Image
              src={imageLink || getFileIcon(presentation.type)}
              className={clsx(
                isImageLoading?
                "w-auto h-auto mx-auto object-cover group-hover/container:scale-105opacity-0 transition-all":
                "w-auto h-auto mx-auto object-cover group-hover/container:scale-105 transition-all "
              )
              }
              alt="Presentation thumbnail"
              draggable="false"
              fill={true}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width:200px) 70vw,(max-width:1200px) 33vw"
            />
          <div className="-z-20 group-hover/container:z-10 focus-within:z-10 relative w-full h-full transition-all  bg-slate-900/20 ">
            <DropdownMenu>
              <DropdownMenuTrigger
                tabIndex={0}
                className="absolute top-1 right-10 focus:outline-none p-1 rounded-full hover:bg-gray-200/70 group/menu focus:bg-gray-200/70"
              >
                <Ellipsis className="rounded-lg border stroke-2  border-cyan-800 hover:border-cyan-600 stroke-cyan-800 hover:stroke-cyan-600 group-focus/menu:stroke-cyan-600 group-focus/menu:border-cyan-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white rounded-lg p-1 my-2">
                <DropdownMenuItem
                  className="text-center p-2 rounded-lg align-middle flex gap-2 items-center hover:bg-gray-200 outline-none hover:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler();
                  }}
                >
                  <Trash className="block size-4" />
                  <span className="block">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href={`/dashboard/${presentation.id}`}
              aria-label="Open the presentation"
              className="absolute top-1 right-1 focus:outline-none p-1 rounded-full hover:bg-gray-200/70 group/external focus:bg-gray-200/70"
              tabIndex={0}
              ref={linkRef}
            >
              <span className="rounded-full border border-cyan-800  block p-1 group-hover/external:border-cyan-600 group-focus/external:border-cyan-600">
                <ExternalLink className="stroke-cyan-800 stroke-2 size-4 group-hover/external:stroke-cyan-600 group-focus/external:stroke-600 "></ExternalLink>
              </span>
            </Link>
          </div>
        </div>
        <h2 className="presentation-title text-lg font-medium my-2 text-slate-700 px-2 group-hover/container:text-cyan-800 group-focus/container:text-cyan-600 group-focus-within/container:text-cyan-600 ">
          {getHighlightedText(presentation.title, highlight)}
        </h2>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
