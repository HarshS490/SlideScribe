import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";


export default function Login() {
  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="text-center">
          <h1 className="font-medium text-3xl text-blue-700">
            Login
          </h1>
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
            <Button type="submit">Login</Button>
          </div>
        </form>
        <div className='flex gap-2 items-center my-2'>
            <hr className='flex-grow  '/>
            <span className='inline-block'>or</span>
            <hr className='flex-grow'/>
        </div>
      </div>
    </div>
  );
}
