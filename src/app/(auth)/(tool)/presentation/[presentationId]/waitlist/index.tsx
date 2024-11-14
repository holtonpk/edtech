"use client";

import React from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

const Waitlist = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div
      className="flex gap-4 flex-col p-[2px] h-fit bg-background rounded-md shadow-lg border w-full items-center justify-center  
            bg-gradient-to-tr from-theme-purple to-theme-green via-theme-blue
            "
    >
      <div className="h-fit w-full bg-background/90 blurBack p-4 rounded-sm flex flex-col gap-2 items-center justify-center">
        <h1 className=" poppins-bold text-center">
          Want early access to interactive presentations, collaboration tools
          and more?
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Join the waitlist</Button>
          </DialogTrigger>
          <DialogContent className="poppins-regular ">
            <div className="grid gap-1">
              <h1 className="poppins-bold text-2xl ">Get early access!</h1>
              <p className="text-muted-foreground">
                Be the first to access the magic of Frizzle AI. Enter your email
                below to get notified when we launch.
              </p>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="grid gap-1">
                <h2 className="text-sm">First name</h2>
                <Input placeholder="First name" />
              </div>
              <div className="grid gap-1">
                <h2 className="text-sm">Last name</h2>
                <Input placeholder="Last name" />
              </div>
            </div>
            <div className="grid gap-1">
              <h2 className="text-sm">Email</h2>
              <Input placeholder="example@gmail.com" />
            </div>
            <Button onClick={handleSubmit} className="grad-animation">
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin ml-4" />
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Waitlist;
