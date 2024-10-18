"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef, use} from "react";
import {Start, Step1} from "./components/steps-new/1";
import {Step2} from "./components/steps-new/2";
import {Step3} from "./components/steps-new/3";
import {StepConnector} from "@mui/material";
import StepContainer from "./components/steps-new/step-container";
import {AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";

const CreateSteps = () => {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  return (
    <div className="h-[calc(100vh-60px)] flex  items-center justify-center gap-10 z-40 relative">
      <Start
        step={step}
        setStep={setStep}
        prevStep={prevStep}
        setPrevStep={setPrevStep}
      />
      <div className="h-fit w-fit absolute flex flex-col gap-8 ">
        <div className="flex flex-row   gap-1 ">
          <StepContainer
            step={step}
            setStep={setStep}
            stepNumber={1}
            title="Describe"
          />
          <StepContainer
            step={step}
            setStep={setStep}
            stepNumber={2}
            title="Upload "
          />
          <StepContainer
            step={step}
            setStep={setStep}
            stepNumber={3}
            title="Format"
          />
          <StepContainer
            step={step}
            setStep={setStep}
            stepNumber={4}
            title="Generate"
          />
        </div>
        <div className="w-full h-[350px] ">
          <AnimatePresence>
            {step === 1 && (
              <Step1
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 2 && (
              <Step2
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 3 && (
              <Step3
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
              />
            )}
          </AnimatePresence>
        </div>

        {step > 0 && (
          <div className="flex justify-between items-center w-full ">
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
  );
};

export default CreateSteps;
