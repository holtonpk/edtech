"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

const StepContainer = ({
  step,
  setStep,
  stepNumber,
  title,
}: {
  step: number;
  title: string;
  stepNumber: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const isActive = step === stepNumber;

  return (
    <AnimatePresence>
      {step > 0 && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className={`flex flex-col   z-50 relative h-fit  w-[80%]

      `}
        >
          <div className="h-fit relative w-full flex    flex-col gap-2">
            <AnimatePresence>
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5, delay: 0.5}}
                className="flex flex-row w-fit items-start gap-4  "
              >
                <div className="flex flex-row  h-full items-start gap-1">
                  <button
                    onClick={() => setStep(stepNumber)}
                    className="flex flex-col gap-1 items-center "
                  >
                    <div
                      className={`flex items-center justify-center border-2 rounded-full aspect-square h-6 z-30 relative transition-colors duration-1000
                 ${
                   step === stepNumber
                     ? "bg-background border-primary text-primary "
                     : step > stepNumber
                     ? "bg-primary border-primary text-white"
                     : "bg-transparent border-muted-foreground text-muted-foreground"
                 }
                `}
                    >
                      <Icons.check className="w-4 h-4 " />
                    </div>
                    <h1
                      className={`poppins-bold
                ${
                  isActive || stepNumber < step
                    ? "text-primary"
                    : "text-muted-foreground"
                }
                `}
                    >
                      {title}
                    </h1>
                  </button>
                  {stepNumber !== 4 && (
                    <div
                      className={`w-[200px] h-[4px] rounded-[3px] mt-4
                    ${
                      step > stepNumber
                        ? "bg-primary"
                        : "bg-muted-foreground/50"
                    }`}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      {/* <AnimatePresence>
        {isActive && (
          <div className="absolute w-[500px] h-40 b-b bg-background rounded-md ">
            {children}
          </div>
        )}
      </AnimatePresence> */}
    </AnimatePresence>
  );
};

export default StepContainer;
