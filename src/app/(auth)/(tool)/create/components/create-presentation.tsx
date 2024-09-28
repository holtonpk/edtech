"use client";
import React, {useState, useRef, useEffect} from "react";
import NavigationButtons from "./navigation-buttons";
import StepPanel from "./step-panel";
import Upload from "./steps/upload";
import Description from "./steps/description";
import Format from "./steps/format";
import Generate from "./steps/generate";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import {Icons} from "@/components/icons";
import Background from "./background";
export function CreatePresentationForm() {
  const [step, setStep] = useState(1);

  const changeStep = (step: number) => {
    setStep(step);
  };

  return (
    <div className="h-screen w-screen items-start  justify-center bg-muted grid grid-rows-[50px_1fr]  ">
      <Background />
      <NavBar />
      <div className="flex justify-center items-center h-full w-screen overflow-scroll z-50">
        {/* <StepPanel step={step} changeStep={changeStep} /> */}

        <div className=" w-1/2 h-full  flex flex-col  pt-10 rounded-lg  gap-4 overflow-scroll ">
          {step === 1 && <Description setStep={setStep} />}
          {step === 2 && <Upload setStep={setStep} />}
          {step === 3 && <Format setStep={setStep} />}
          {step === 4 && <Generate setStep={setStep} />}
          {/* <NavigationButtons step={step} changeStep={changeStep} /> */}
        </div>
      </div>
    </div>
  );
}

const NavBar = () => {
  return (
    <div className="h-full w-full bg-background/50 blurBack3 z-50 border-b flex items-center justify-between px-10">
      <div className="flex gap-1 items-center">
        <Icons.lightbulb className="w-6 h-6 text-primary" />
        <h1 className="font-bold">EDTech tool</h1>
      </div>
      <ProfileNav />
    </div>
  );
};
