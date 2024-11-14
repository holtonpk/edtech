"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef, use} from "react";
import {Start} from "./components/steps/start";
import {Step1} from "./components/steps/1";
import {Step2} from "./components/steps/2";
import {Step3} from "./components/steps/3";
import {Step4} from "./components/steps/4";
import {Step5} from "./components/steps/5";
import {StepConnector} from "@mui/material";
import StepContainer from "./components/steps/step-container";
import {AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/toaster";
import {FileLocal} from "@/config/data";
import {motion} from "framer-motion";
import {usePresentationCreate} from "@/context/presentation-create-context";

const CreateSteps = () => {
  const {step, setStep, prevStep, setPrevStep, isGenerating} =
    usePresentationCreate()!;

  return (
    <div className="h-[calc(100vh-60px)] flex items-center justify-center gaps-10 z-40 relative  w-screen">
      <div className="h-fit w-fit absolute flex flex-col gap-4">
        {step < 5 && !isGenerating && (
          <div className="flex flex-row   gap-1 ">
            <StepContainer stepNumber={1} title="Upload" />
            {/* <StepContainer stepNumber={2} title="Describe" /> */}
            <StepContainer stepNumber={2} title="Format" />
            <StepContainer stepNumber={3} title="Generate" />
          </div>
        )}
        {step < 5 && (
          <div className="w-full h-[450px] min-w-[400px] ">
            <AnimatePresence>{step === 1 && <Step1 />}</AnimatePresence>
            {/* <AnimatePresence>{step === 2 && <Step2 />}</AnimatePresence> */}
            <AnimatePresence>{step === 2 && <Step3 />}</AnimatePresence>
            <AnimatePresence>{step === 3 && <Step4 />}</AnimatePresence>
          </div>
        )}
        <div className="h-10">
          {step > 0 && step < 3 && (
            <div className="flex justify-between items-center w-full mt-auto ">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant={"ghost"}
                  className="flex items-center "
                >
                  <Icons.chevronLeft className="w-6 h-6" />
                  Prev step
                </Button>
              )}
              <Button
                onClick={() => setStep(step + 1)}
                className="flex items-center ml-auto"
              >
                Next step <Icons.chevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
        {/* {isGenerating && <Step5 />} */}
        {/* {step === 3 && (
          <div className="flex flex-col justify-between items-center w-full">
            <Button
              onClick={() => setStep(step + 1)}
              className="flex items-center w-fit px-[150px] gap-1 text-xl poppins-bold py-6"
            >
              <Icons.sparkles className="w-6 h-6" />
              Generate
            </Button>
            <Button
              onClick={() => setStep(step - 1)}
              variant={"ghost"}
              className="flex items-center absolute -bottom-2 translate-y-full"
            >
              <Icons.chevronLeft className="w-6 h-6" />
              Prev step
            </Button>
          </div>
        )} */}
      </div>

      <Toaster />
    </div>
  );
};

export default CreateSteps;
