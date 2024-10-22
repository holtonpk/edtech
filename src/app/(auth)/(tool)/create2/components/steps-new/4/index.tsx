"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";
import {Slider} from "@/components/ui/slider";
export const Step4 = ({
  step,
  setStep,
  prevStep,
  setPrevStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  prevStep: number;
  setPrevStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useEffect(() => {
    setPrevStep(3);
  }, []);

  return (
    <motion.div
      exit={{opacity: 0, transform: "translateX(200px)"}}
      animate={{opacity: 1, transform: "translateY(0px)"}}
      initial={
        prevStep === 0
          ? {opacity: 1, transform: "translateY(200px)"}
          : prevStep > 3
          ? {opacity: 1, transform: "translateX(-200px)"}
          : {opacity: 1, transform: "translateX(200px)"}
      }
      transition={{duration: 0.3}}
      className="w-full h-[450px] absolute rounded-md overflow-hidden "
    >
      <div className="ball-container ">
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div>
    </motion.div>
  );
};

const SlideFormat = () => {
  type Format = "less-words" | "more-words" | "bullet-points";

  const [selectedFormat, setSelectedFormat] =
    React.useState<Format>("less-words");

  return (
    <div className="grid gap-3">
      <div className="grid gap-0">
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
            </div>
          </div>
          <h1 className="font-bold text-center mt-2"> Less Words</h1>
          <p className="text-center text-muted-foreground text-sm mb-3">
            Slide will have less words and more images, this is great for visual
            learners
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
            Slide will have more words and less images, this is great for
            auditory learners
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
            Slide will have bullet points, this is great for summarizing
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
            Slide will have bullet points, this is great for summarizing
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
      </div>
    </div>
  );
};
