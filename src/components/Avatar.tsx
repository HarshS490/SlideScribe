import { User } from "@prisma/client";
import React from "react";

import Image from "next/image";

type Props = {
  user: User | null;
};

const Avatar = ({ user }: Props) => {
  return (
    <div className="flex items-center cursor-pointer">
      <div className="rounded-full inline-block overflow-hidden h-9 w-9 md:h-9 md:w-9 hover:ring-2 hover:ring-cyan-600">
        {<Image src={user?.image || "/avatar.svg" } alt="Avatar" width={40} height={40} className="w-auto h-auto hover:opacity-85"/>}
      </div>
    </div>
  );
};

export default Avatar;
