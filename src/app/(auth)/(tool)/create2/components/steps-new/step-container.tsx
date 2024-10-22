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
          <div className="h-fit relative w-full flex flex-col gap-2">
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
                      className={`flex items-center justify-center border-2 rounded-full aspect-square h-6 z-30 relative transition-colors duration-500 delay-[.5s] text-sm
                 ${
                   step === stepNumber
                     ? "bg-background border-primary text-primary "
                     : step > stepNumber
                     ? "bg-primary border-primary text-white"
                     : "bg-transparent border-muted-foreground text-muted-foreground"
                 }
                `}
                    >
                      {step <= stepNumber ? (
                        stepNumber
                      ) : (
                        <Icons.check className="w-4 h-4 " />
                      )}
                    </div>
                    <motion.h1
                      className={`poppins-bold 
                         transition-colors duration-500 delay-[.5s]
                ${
                  isActive || stepNumber < step
                    ? "text-primary"
                    : "text-muted-foreground"
                }
                `}
                    >
                      {title}
                    </motion.h1>
                  </button>
                  {stepNumber !== 4 && (
                    <div
                      className={`w-[200px] h-[4px] rounded-[3px] mt-4 bg-muted-foreground/50 relative overflow-hidden
                    `}
                    >
                      <AnimatePresence>
                        <motion.div
                          animate={
                            stepNumber + 1 === step
                              ? {width: "100%"}
                              : stepNumber === step
                              ? {width: "0%"}
                              : stepNumber >= step
                              ? {width: "0%"}
                              : {width: "100%"}
                          }
                          transition={{duration: 0.5}}
                          initial={{width: "0%"}}
                          className="absolute  bg-primary h-full w-0"
                        ></motion.div>
                      </AnimatePresence>
                    </div>
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
