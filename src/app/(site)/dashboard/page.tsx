import getSession from "@/app/actions/getSession";
import Navbar from "@/components/Navbar";

import React from "react";

const page = async () => {
  const data = await getSession();
  return (
    <>
      <header>
        <Navbar user={data?.user} />
      </header>
      <div className="w-full p-4 my-1">
        <main className="md:w-11/12 w-full mx-auto ">
          <span className="block text-base md:text-xl font-medium min-w-max">Your Presentation</span>
          <div className="my-3">
            
          </div>
        </main>
      </div>
    </>
  );
};

export default page;
