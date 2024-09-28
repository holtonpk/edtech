"use client";
import React from "react";
import {usePresentation} from "@/context/presentation-context";
import SlideSelector from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide-selector";
import RightPanel from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/right-panel";
import Slide from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide";
import {Button} from "@/components/ui/button";
import Background from "./slide/background";

const Editor = () => {
  const {slideData, createNewSlide, mode} = usePresentation()!;

  if (!slideData) return null;

  return (
    <div className=" h-full  w-screen  z-10   dot-backgrounds bgs-[#F0F6F6]  flex flex-col relative ">
      <Background />
      <div
        className={`  w-full h-full   overflow-hidden  items-center grid gap-4  pb-4
        ${mode === "default" ? "default-grid" : "open-menu-grid"}
        `}
      >
        {slideData.slides.length ? (
          <>
            <RightPanel />
            <Slide />
          </>
        ) : (
          <>
            <button
              onClick={createNewSlide}
              className="relative h-full flex flex-col justify-center items-center w-full border-4 rounded-md border-dashed hover:border-primary  hover:text-primary transition-colors duration-200 col-span-3"
            >
              <p className="text-2xl font-bold text-primary">
                This presentation doesn&apos;t have any slides
              </p>

              <p className="text-2xl text-gray-400">Click to add a slide</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Editor;
