import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import SocialAction from "./SocialAction";

export default function SignUp() {
  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="text-center">
          <h1 className="font-medium text-3xl text-blue-700">Sign Up</h1>
        </div>
        <form>
          <div className="flex flex-col flex-1  space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Input
                name="Email"
                type="text"
                placeholder="Email"
                className={cn({ "focus-visible:ring-red-500": true })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className={cn({ "focus-visible:ring-red-500": true })}
              />
            </div>
            <Button type="submit">Sign Up</Button>
            <p>
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-blue-600 underline underline-offset-2"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
        <div className="flex gap-2 items-center">
          <hr className="flex-grow  " />
          <span className="inline-block">or</span>
          <hr className="flex-grow" />
        </div>
        <SocialAction/>
      </div>
    </div>
  );
}
