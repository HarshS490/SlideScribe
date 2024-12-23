import getPresentationById from "@/app/actions/getPresentationById";
import PresentationNarration from "@/components/dashboard/PresentationNarration";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    pid: string;
  };
};

async function page({ params }: Props) {
  const docid = params.pid;
  const presentation = await getPresentationById(docid);
  if(!presentation){
    notFound();
  }
  return (
    <>
      <div className="p-4">
        <section className="flex gap-2 my-4 items-center justify-between px-4">
          <Link href={"/dashboard"}>
            <Button
              type="button"
              variant={"secondary"}
              className="text-cyan-800 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
              &nbsp;
              <span className="block sm:text-lg">Dashboard</span>
            </Button>
          </Link>
          <Button className="bg-cyan-700 hover:bg-cyan-600">
            <Download className="w-5 h-5 " />
            &nbsp;<span className="hidden sm:block sm:text-lg">Download</span>
          </Button>
        </section>
        <section>
          <h1 className="text-center text-xl font-semibold text-cyan-900">
            {presentation?presentation.title:"No file Found"}
          </h1>
          <PresentationNarration presentation={presentation}/>
        </section>
      </div>
    </>
  );
}

export default page;
