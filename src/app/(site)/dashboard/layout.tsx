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
      <WidthWrapper>
        <header>
          <Navbar user={data?.user} />
        </header>

        {children}
      </WidthWrapper>
    </>
  );
}

export default layout;
