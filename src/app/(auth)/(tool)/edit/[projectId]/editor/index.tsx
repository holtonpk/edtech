"use client";
import React, {useEffect} from "react";
import {usePresentation} from "@/context/presentation-context";
import SlideSelector from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide-selector";
import {ActionTabs} from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/action-tabs";
import Slide from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide";
import {Button} from "@/components/ui/button";

const Editor = () => {
  const {slideData, createNewSlide, mode} = usePresentation()!;

  if (!slideData) return null;

  const updateVWandVH = () => {
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    document.documentElement.style.setProperty("--dynamic-vw", `${vw}px`);
    document.documentElement.style.setProperty("--dynamic-vh", `${vh}px`);
  };

  useEffect(() => {
    // Set initial values when the component mounts
    updateVWandVH();

    // Update values on window resize
    window.addEventListener("resize", updateVWandVH);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", updateVWandVH);
    };
  }, []);

  return (
    <div className="editor-container editorContainer-size  z-30  flex flex-col relative mx-auto">
      <div
        className={`  h-full  items-center grid gap-2 relative w-full 
        ${mode === "default" ? "default-grid" : "open-menu-grid"}
        `}
      >
        {slideData.slides.length ? (
          <>
            <ActionTabs />
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
