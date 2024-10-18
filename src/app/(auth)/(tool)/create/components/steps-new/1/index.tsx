"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";

export const Start = ({
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
    setPrevStep(0);
  }, []);

  const isActive = step === 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{opacity: 1}}
          initial={{opacity: 1}}
          transition={{duration: 0.3}}
          exit={{opacity: 0, transform: "translateY(200px)"}}
          className={`flex flex-col items-center justify-center z-50 relative h-[calc(100vh-60px)] 
w-screen
    `}
        >
          <div className="h-fit relative w-full flex items-center   flex-col gap-4">
            <div className="flex flex-col items-center  h-[80px] top-0 ">
              <h1 className="text-5xl font-bold poppins-bold">
                Generate a new slideshow
              </h1>
              <p className="poppins-regular">
                Follow the steps below to create a slideshow
              </p>
            </div>

            <div className="w-[400px] border shadow-xl  rounded-md h-12 min-h-12 overflow-hidden relative flex items-center bg-background  ">
              <textarea
                //   rows={isActive ? 1}
                // value={
                //   "Create a detailed presentation for my 8th grade history class about the American Civil War"
                // }
                placeholder="Describe your project"
                className=" h-12 pt-[12px] no-resize  w-[calc(100%-44px)] overflow-hidden  pl-2 noFocus relative whitespace-nowrap   text-base"
                //   readOnly={isActive}
              />

              <button
                onClick={() => setStep(2)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-primary rounded-full p-[2px]  aspect-square h-fit w-fit group"
              >
                <Icons.chevronRight className="h-6 w-6 text-muted transition-transform duration-200 group-hover:translate-x-[3px] delay-100" />
              </button>
            </div>

            <AnimatePresence>
              <motion.div
                initial={{height: "120px"}}
                exit={{height: 0}}
                transition={{duration: 0.5, delay: 0.5}}
                className=" max-w-[800px] w-[80%] grid grid-cols-3 gap-10 mt-4"
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
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Step1 = ({
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
    setPrevStep(1);
  }, []);
  return (
    <motion.div
      exit={{opacity: 0, transform: "translateX(-200px)"}}
      animate={{opacity: 1, transform: "translateY(0px)"}}
      initial={
        prevStep === 0
          ? {opacity: 1, transform: "translateY(200px)"}
          : prevStep > 1
          ? {opacity: 1, transform: "translateX(-200px)"}
          : {opacity: 1, transform: "translateX(200px)"}
      }
      transition={{duration: 0.3}}
      className="w-full h-[350px] flex flex-col items-center gap-4 justify-center  absolute"
    >
      <div className="flex flex-col items-center max-w-[50%] text-center">
        <h1 className="poppins-bold text-xl">Describe your project</h1>
        <p className="poppins-regular text-muted-foreground">
          Describe your project in as much detail as you can this will help us
          generate a slideshow that fits your needs
        </p>
      </div>
      <textarea
        name=""
        className="bg-background w-[600px]  border p-2 rounded-md shadow-xl no-resize"
      >
        Create a detailed presentation for my 8th grade history class about the
        American Civil War
      </textarea>
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
