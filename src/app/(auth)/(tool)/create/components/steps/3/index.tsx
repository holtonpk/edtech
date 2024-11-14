"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";
import {Slider} from "@/components/ui/slider";
import {usePresentationCreate} from "@/context/presentation-create-context";
export const Step3 = () => {
  const {step, setStep, prevStep, setPrevStep, slideCount, setSlideCount} =
    usePresentationCreate()!;

  useEffect(() => {
    setPrevStep(2);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <motion.div
      exit={
        step > 2
          ? {opacity: 0, transform: "translateX(-200px)"}
          : {opacity: 0, transform: "translateX(200px)"}
      }
      animate={{opacity: 1, transform: "translate(0px)"}}
      initial={
        prevStep === 0
          ? {opacity: 1, transform: "translateY(200px)"}
          : prevStep > 2
          ? {opacity: 1, transform: "translateX(-200px)"}
          : {opacity: 1, transform: "translateX(200px)"}
      }
      transition={{duration: 0.3}}
      className="w-full h-[450px] absolute rounded-md overflow-hidden "
    >
      {isScrolled && (
        <div className="absolute left-0 bottom-0 translate-y-full w-full  z-30  fade-in-0 duration-500">
          <div className="upload-manager-grad-top w-full h-16 z-30 pointer-events-none"></div>
        </div>
      )}

      <div className="w-full h-[400px] overflow-scroll flex-col gap-4 flex  pt-2  absolute  rounded-md ">
        <SlideFormat />
      </div>

      {/* <div className="absolute  left-0 bottom-0  w-full pointer-events-none z-30 animate-in fade-in-0 duration-500">
        <div className="upload-manager-grad-bottom w-full h-12 z-30 pointer-events-none"></div>
      </div> */}
    </motion.div>
  );
};

const SlideFormat = () => {
  const {selectedFormat, setSelectedFormat} = usePresentationCreate()!;
  return (
    <div className="grid gap-3">
      <div className="grid gap-0 text-center">
        <h1 className="poppins-bold text-xl">Select a layout</h1>
        <p className="poppins-regular">This is how the slide will appear </p>
      </div>
      <div className="grid grid-cols-4 gap-4 w-[100%] mx-auto">
        <button
          onClick={() => setSelectedFormat("less-words")}
          className={`p-2 border flex flex-col rounded-md group cursor-pointer items-center hover:border-primary transition-colors bg-background shadow-lg
    ${selectedFormat === "less-words" ? "border-primary " : ""}
            
            `}
        >
          <div className="border rounded-md w-full h-fit">
            <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md shadow-lg">
              <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              <div className="w-[75%] h-4 bg-primary/30 rounded-full"></div>
              <div className="w-[75%] h-4 bg-background rounded-full"></div>
            </div>
          </div>
          <h1 className="font-bold text-center mt-2"> Less Words</h1>
          <p className="text-center text-muted-foreground text-sm mb-3">
            Slides will have less words and more images, this is great for
            visual learners
          </p>
          <div
            className={`h-5 w-5 mx-auto mt-auto rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
              ${
                selectedFormat === "less-words"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }
              `}
          >
            <div
              className={`group-hover:block h-2 w-2 bg-background rounded-full
     ${selectedFormat === "less-words" ? "block" : "hidden"}
                `}
            />
          </div>
        </button>
        <button
          onClick={() => setSelectedFormat("more-words")}
          className={`p-2 border flex flex-col rounded-md group cursor-pointer items-center hover:border-primary transition-colors bg-background shadow-lg
    ${selectedFormat === "more-words" ? "border-primary" : ""}
            
            `}
        >
          <div className="border rounded-md w-full h-fit">
            <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md shadow-lg">
              <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
              <div className="w- h-4 bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            </div>
          </div>
          <h1 className="font-bold text-center mt-2"> More Words</h1>
          <p className="text-center text-muted-foreground text-sm mb-3">
            Slides will have more words and less images, this is great for
            including more detail
          </p>
          <div
            className={`h-5 w-5 mx-auto mt-auto rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
              ${
                selectedFormat === "more-words"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }
              `}
          >
            <div
              className={`group-hover:block h-2 w-2 bg-background rounded-full 
     ${selectedFormat === "more-words" ? "block" : "hidden"}
                `}
            />
          </div>
        </button>
        <button
          onClick={() => setSelectedFormat("bullet-points")}
          className={`p-2 border flex flex-col  rounded-md group cursor-pointer items-center hover:border-primary transition-colors bg-background shadow-lg
    ${selectedFormat === "bullet-points" ? "border-primary" : ""}
            
            `}
        >
          <div className="border rounded-md w-full h-fit">
            <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md shadow-lg">
              <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
              <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              </div>
              <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              </div>
              <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              </div>
            </div>
          </div>

          <h1 className="font-bold text-center mt-2"> Bullet points</h1>
          <p className="text-center text-muted-foreground text-sm mb-3">
            Slides will have bullet points, this is great for summarizing
          </p>
          <div
            className={`h-5 w-5 mt-auto mx-auto  rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
              ${
                selectedFormat === "bullet-points"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }
              `}
          >
            <div
              className={`group-hover:block h-2 w-2 bg-background rounded-full
     ${selectedFormat === "bullet-points" ? "block" : "hidden"}
                `}
            />
          </div>
        </button>
        <button
          onClick={() => setSelectedFormat("mixed")}
          className={`p-2 border flex flex-col  rounded-md group cursor-pointer items-center hover:border-primary transition-colors bg-background shadow-lg relative
    ${selectedFormat === "mixed" ? "border-primary" : ""}
            
            `}
        >
          <div className=" relative w-full overflow-hidden rounded-md shadow-lg border">
            <div className=" rounded-md w-full h-fit ">
              <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md ">
                <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
                <div className="w-[75%] h-4 bg-primary/30 rounded-full"></div>
                <div className="w-[75%] h-4 bg-background rounded-full"></div>
              </div>
            </div>
            <div className="border rounded-md w-full h-fit absolute top-6 left-6">
              <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md">
                <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
                <div className="w- h-4 bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
                <div className="w-full h-4 bg-primary/30 rounded-full"></div>
              </div>
            </div>
            <div className="border rounded-md w-full h-fit absolute top-12 left-12">
              <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md ">
                <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
                <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                  <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                  <div className="w-full h-4 bg-primary/30 rounded-full"></div>
                </div>
                <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                  <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                  <div className="w-full h-4 bg-primary/30 rounded-full"></div>
                </div>
                <div className="grid grid-cols-[10px_1fr] items-center gap-1">
                  <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
                  <div className="w-full h-4 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="font-bold text-center mt-2"> Mix it up</h1>
          <p className="text-center text-muted-foreground text-sm mb-3">
            Slides will be a mix of less words, more words and bullet points
          </p>
          <div
            className={`h-5 w-5 mt-auto mx-auto  rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
              ${
                selectedFormat === "mixed"
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }
              `}
          >
            <div
              className={`group-hover:block h-2 w-2 bg-background rounded-full
     ${selectedFormat === "mixed" ? "block" : "hidden"}
                `}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
