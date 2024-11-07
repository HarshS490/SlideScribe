import getSession from "@/app/actions/getSession";
import Navbar from "@/components/Navbar";
import WidthWrapper from "@/components/WidthWrapper";

import React from "react";

type Props = {
  children: React.ReactNode;
};

async function layout({ children }: Props) {
  const data = await getSession();
  return (
    <>
      <header className="relative mb-20">
        <Navbar user={data?.user} />
      </header>
      <WidthWrapper>

        {children}
      </WidthWrapper>
    </>
  );
}

export default layout;
