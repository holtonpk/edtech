"use client";

import {motion, AnimatePresence} from "framer-motion";

import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/components/ui/use-toast";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import {
  FILE_SIZE,
  FileLocal,
  MAX_FILE_SIZE_MB,
  UploadType,
} from "@/config/data";
import NavigationButtons from "../../navigation-buttons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Position} from "../../../../edit/[projectId]/editor/slide-selector/slide-menu/Mini-Slide";
import StepContainer from "../step-container";
import {Slider} from "@/components/ui/slider";

export const Step2 = ({
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
  //   const [isActive, setIsGenerating] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setPrevStep(2);
    }, 1000);
  }, []);

  const [slideCount, setSlideCount] = useState([5]);

  return (
    <motion.div
      exit={{opacity: 0, transform: "translateX(-200px)"}}
      animate={{opacity: 1, transform: "translateY(0px)"}}
      initial={
        prevStep === 0
          ? {opacity: 1, transform: "translateY(200px)"}
          : prevStep > 2
          ? {opacity: 1, transform: "translateX(-200px)"}
          : {opacity: 1, transform: "translateX(200px)"}
      }
      transition={{duration: 0.3}}
      className="w-full h-[450px]  flex flex-col  gap-4 justify-centers pt-4  absolute"
    >
      <div className="flex flex-col max-w-[50%] text-left">
        <h1 className="poppins-bold text-xl">Describe your project</h1>
        <p className="poppins-regular text-muted-foreground">
          This will help us generate a slideshow that fits your needs
        </p>
      </div>
      <div className="w-full border shadow-xl  rounded-md h-[150px] min-h-12 overflow-hidden relative flex items-center bg-background  ">
        {/* <div className="w-[400px] border shadow-xl  rounded-md h-12 min-h-12 overflow-hidden relative flex items-center bg-background  "> */}
        <textarea
          //   rows={isActive ? 1}
          // value={
          //   "Create a detailed presentation for my 8th grade history class about the American Civil War"
          // }
          placeholder="Describe your vision..."
          className="h-full pt-[12px] no-resize pl-6  w-[calc(100%-44px)] overflow-hidden noFocus relative whitespace-nowrap   text-base"
          //   readOnly={isActive}
        />
        {/* <AnimatePresence>
          <motion.div
            initial={{height: "120px"}}
            exit={{height: 0}}
            transition={{duration: 0.5, delay: 0.5}}
            className=" max-w-[800px] w-[100%]  absolute bottom-0 grid grid-cols-3 gap-10 mt-4"
          >
            <>
              <PresetCard
                key="card-1"
                delay={0.1}
                displayedText="Create a detailed presentation for my 8th grade history class about the American Civil War"
              />
              <PresetCard
                key="card-2"
                delay={0.2}
                displayedText="I want a fun slide show to teach my 5th grade students about reptiles"
              />
              <PresetCard
                key="card-3"
                delay={0.3}
                displayedText="Create a presentation to help teach the uploaded text book pages"
              />
            </>
          </motion.div>
        </AnimatePresence> */}
        {/* 
        <button
          onClick={() => setStep(2)}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary rounded-full p-[2px]  aspect-square h-fit w-fit group"
        >
          <Icons.chevronRight className="h-6 w-6 text-muted transition-transform duration-200 group-hover:translate-x-[3px] delay-100" />
        </button> */}
      </div>

      {/* <div className="grid gap-3">
        <div className="grid gap-1">
          <h1 className="poppins-bold text-xl">Number of slides</h1>
          <p className="poppins-regular">
            How many slides would you like to generate?
          </p>
        </div>
        <div className="flex w-full gap-4">
          <h1 className="whitespace-nowrap text-primary poppins-bold text-2xl  w-12 flex items-center justify-center">
            {slideCount[0]}
          </h1>
          <Slider
            className="w-[60%]"
            min={1}
            max={15}
            value={slideCount}
            onValueChange={setSlideCount}
          />
        </div>
      </div> */}
      {/* </div> */}
    </motion.div>
  );
};

const PresetCard = ({
  displayedText,
  delay,
}: {
  displayedText: string;
  delay: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<string>("54px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // When opened, get the full height of the content
      setHeight(`${contentRef.current.scrollHeight + 12}px`);
    } else {
      // When closed, set it to the initial height (collapsed state)
      setHeight("54px");
    }
  }, [isOpen]);

  return (
    <motion.button
      initial={{opacity: 0, transform: "translateY(100px)"}}
      animate={{opacity: 1, transform: "translateY(0px)"}}
      exit={{opacity: 0, transform: "translateY(100px)"}}
      transition={{duration: 0.2, delay: delay}}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`w-full flex gap-2 items-start rounded-lg p-2 bg-background transition-all duration-200 overflow-hidden
          ${isOpen ? "shadow-xl" : ""}
          `}
      style={{height}} // Dynamically change the button's height
    >
      <Icons.sparkles
        style={{height: "16px", width: "16px"}}
        className="mt-[4px] text-primary"
      />

      <div
        ref={contentRef}
        className={`text-left poppins-regular text-sm  ${
          isOpen ? "h-fit" : "presentCard-content-closed"
        }`}
      >
        {displayedText}
      </div>
    </motion.button>
  );
};
