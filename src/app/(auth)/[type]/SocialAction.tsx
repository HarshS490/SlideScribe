import { Button } from "@/components/ui/button";
import React from "react";

export default function SocialAction() {
  return (
      <Button type="button" variant={"secondary"} className="flex gap-2">
        <span className="icon-[logos--google-icon] w-4 h-4"></span>
        Continue With Google
      </Button>
  );
}
