"use client";
import React, {useEffect} from "react";
import {usePresentation} from "@/context/presentation-context";
import SlideSelector from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide-selector";
import {ActionTabs} from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/action-tabs";
import Slide from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Icons} from "@/components/icons";
import Background from "../background";

const Editor = () => {
  const {slideData, createNewSlide, mode} = usePresentation()!;

  // if (!slideData) return null;

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

  const [loadingProgress, setLoadingProgress] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (loadingProgress <= 100) {
      setTimeout(() => {
        setLoadingProgress(loadingProgress + 1);
        if (loadingProgress === 100) {
          setIsLoading(false);
        }
      }, 5);
    }
  }, [loadingProgress]);

  return (
    <>
      <div
        className={`flex fixed flex-col items-center justify-center  gap-4 top-0 z-[9999] w-screen h-screen bg-background
          ${isLoading ? "visible" : "fade-out-to-hidden "}
          `}
      >
        <Background />
        <div className="p-6 rounded-lg h-fit w-fit bg-primary/20">
          <Icons.logo className="h-20 w-20 text-theme-blue" />
        </div>
        {/* <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" /> */}
        <Progress
          value={loadingProgress}
          className="w-[200px] bg-primary/5 border border-border"
        />
      </div>

      {slideData ? (
        <div className="editor-container editorContainer-size  z-30  flex flex-col relative mx-auto">
          {slideData && (
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
                    onClick={() => createNewSlide()}
                    className="relative h-full flex flex-col justify-center items-center w-full border-4 rounded-md border-dashed hover:border-primary  hover:text-primary transition-colors duration-200 col-span-3"
                  >
                    <p className="text-2xl font-bold text-primary">
                      This presentation doesn&apos;t have any slides
                    </p>

                    <p className="text-2xl text-gray-400">
                      Click to add a slide
                    </p>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen w-screen poppins-bold text-2xl items-center justify-center flex flex-col">
          <Icons.sad className="h-20 w-20 " />
          sorry this project doesn&apos;t exist
        </div>
      )}
    </>
  );
};

export default Editor;
