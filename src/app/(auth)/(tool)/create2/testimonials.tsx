"use client";
import {Icons} from "@/components/icons";
import React from "react";
import {motion} from "framer-motion";

export const Testimonials = () => {
  return (
    <div className="h-fit w-screen z-30 relative  container">
      <div className="flex flex-col items-center  text-center ">
        <div className="flex gap-1 flex-col">
          <h1 className="text-4xl poppins-bold">
            Why teachers love Frizzle ai{" "}
          </h1>
          <p className="poppins-regular">
            Why over 10,000 teachers use Frizzle ai everyday
          </p>
        </div>
        <div className="grid grid-cols-3 py-10 w-full items-center gap-8">
          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.clock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">Save time</h1>
            <p className="poppins-regular">
              Frizzle AI can create presentations in minutes. Just upload your
              content and let Frizzle AI do the rest.
            </p>
          </div>
          {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}
          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border ">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.history className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">Repurpose old content</h1>
            <p className="poppins-regular">
              With Frizzle AI, you can turn anything into a presentation. Just
              upload your content and let Frizzle AI do the rest.
            </p>
          </div>
          {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}

          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.smile className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">Students love it</h1>
            <p className="poppins-regular">
              Student love slides. With Frizzle AI, you can create slides in
              minutes. Just upload your content and let Frizzle AI do the rest.
            </p>
          </div>
        </div>
        {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}
      </div>
    </div>
  );
};
