import getSession from "@/app/actions/getSession";
import Navbar from "@/components/Navbar";
import WidthWrapper from "@/components/WidthWrapper";
import React from "react";
type Props = {
  children: React.ReactNode;
};

async function layout({ children }: Props) {
  const session = await getSession();
  const user = session?.user ?{
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  }:null;
  return (
    <>
      <header className="relative mb-20">
        <Navbar user={user} />
      </header>
      <WidthWrapper>{children}</WidthWrapper>
    </>
  );
}

export default layout;
