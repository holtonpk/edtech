"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef, use} from "react";
import {Start} from "./components/steps-new/start";
import {Step1} from "./components/steps-new/1";
import {Step2} from "./components/steps-new/2";
import {Step3} from "./components/steps-new/3";
import {Step4} from "./components/steps-new/4";
import {Step5} from "./components/steps-new/5";
import {StepConnector} from "@mui/material";
import StepContainer from "./components/steps-new/step-container";
import {AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/toaster";
import {FileLocal} from "@/config/data";

const CreateSteps = () => {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  const dummyFiles = [
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "asdfa",
      title: "1test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "1",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "adfadsf",
      title: "2test.pdf",
      type: "jpg" as FileLocal["type"],
      id: "2",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "fadasd",
      title: "3test.pdf",
      type: "mp4" as FileLocal["type"],
      id: "3",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "hgdfgfhd",
      title: "4test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "4",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "wrwreetw",
      title: "5test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "5",
    },
  ];

  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [files, setFiles] = useState<FileLocal[] | undefined>(dummyFiles);

  return (
    <div className="h-[calc(100vh-60px)] flex items-center justify-center gap-10 z-40 relative">
      <Start
        step={step}
        setStep={setStep}
        prevStep={prevStep}
        setPrevStep={setPrevStep}
        inputFiles={inputFiles}
        setInputFiles={setInputFiles}
      />
      <div className="h-fit w-fit absolute flex flex-col gap-4 ">
        {step < 5 && (
          <div className="flex flex-row   gap-1 ">
            <StepContainer
              step={step}
              setStep={setStep}
              stepNumber={1}
              title="Upload"
            />
            <StepContainer
              step={step}
              setStep={setStep}
              stepNumber={2}
              title="Describe"
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
        )}
        <div className="w-full h-[450px] min-w-[400px]">
          <AnimatePresence>
            {step === 1 && (
              <Step1
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
                inputFiles={inputFiles}
                setInputFiles={setInputFiles}
                files={files}
                setFiles={setFiles}
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
          <AnimatePresence>
            {step === 4 && (
              <Step4
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 5 && (
              <Step5
                step={step}
                setStep={setStep}
                prevStep={prevStep}
                setPrevStep={setPrevStep}
              />
            )}
          </AnimatePresence>
        </div>

        {step > 0 && step < 4 && (
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
        {step === 4 && (
          <div className="flex flex-col justify-between items-center w-full mt-auto gap-1 ">
            <Button
              onClick={() => setStep(step + 1)}
              className="flex items-center w-full"
            >
              Generate
            </Button>
            <Button
              onClick={() => setStep(step - 1)}
              variant={"ghost"}
              className="flex items-center "
            >
              <Icons.chevronLeft className="w-6 h-6" />
              Prev step
            </Button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default CreateSteps;
