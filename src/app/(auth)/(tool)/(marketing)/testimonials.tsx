"use client";
import {Icons} from "@/components/icons";
import React from "react";
import {motion} from "framer-motion";

export const Testimonials = () => {
  return (
    <div className="h-fit w-screen z-30 relative mt-20 md:mt-10 container">
      <div className="flex flex-col items-center  text-center ">
        <div className="flex gap-1 flex-col">
          <h1 className="text-4xl poppins-bold">
            Why teachers Love Frizzle AI{" "}
          </h1>
          <p className="poppins-regular">
            Over 10,000 teachers saving time with Frizzle AI.
          </p>
        </div>
        <div className="grid md:grid-cols-3 py-10 w-full items-center gap-8">
          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.clock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">
              Save Time and Automate Lesson Creation.
            </h1>
            <p className="poppins-regular">
              Turn any resource into a presentation, instead of starting from
              scratch every time. Build lessons faster and focus on what matters
              most, actually teaching.
            </p>
          </div>
          {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}
          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border ">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.history className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">
              Integrates with Canva, Google Slides and Powerpoint.
            </h1>
            <p className="poppins-regular">
              With on click, export directly to Canva, PowerPoint, or Google
              Slides, making it easy to customize and adapt presentations
              without switching platforms. 
            </p>
          </div>
          {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}

          <div className="flex flex-col gap-1 w-full items-center bg-background p-4 rounded-md shadow-xl border">
            <div className="h-10 w-10 rounded-sm bg-primary/20 flex items-center justify-center">
              <Icons.smile className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl poppins-bold">
              Never run out of teaching material.
            </h1>
            <p className="poppins-regular">
              Say goodbye to &quote;teacher&apos;s block.&quote; Easily
              repurpose any interesting article, YouTube video, or even an old
              class presentation into fresh, engaging slides with just a few
              clicks.
            </p>
          </div>
        </div>
        {/* <div className="h-[75px] w-[2px] bg-muted"></div> */}
      </div>
    </div>
  );
};
