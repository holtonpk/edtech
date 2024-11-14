"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef, use} from "react";
import {Start} from "./start";
import {Step1} from "@/src/app/(auth)/(tool)/create/components/steps/1";
import {Step2} from "@/src/app/(auth)/(tool)/create/components/steps/2";
import {Step3} from "@/src/app/(auth)/(tool)/create/components/steps/3";
import {Step4} from "@/src/app/(auth)/(tool)/create/components/steps/4";
import {StepConnector} from "@mui/material";
import StepContainer from "@/src/app/(auth)/(tool)/create/components/steps/step-container";
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
      <Start
        step={step}
        setStep={setStep}
        prevStep={prevStep}
        setPrevStep={setPrevStep}
      />
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
              <Button
                onClick={() => setStep(step - 1)}
                variant={"ghost"}
                className="flex items-center "
              >
                <Icons.chevronLeft className="w-6 h-6" />
                Prev step
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                className="flex items-center "
              >
                Next step <Icons.chevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default CreateSteps;
