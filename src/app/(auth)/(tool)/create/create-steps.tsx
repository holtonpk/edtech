"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";

const CreateSteps = () => {
  return (
    <div className="h-[calc(100vh-60px)] w-screen flex flex-col items-center justify-center z-50 relative">
      <h1 className="text-4xl font-bold">Generate a new slideshow</h1>
      <p className="">Follow the steps below to create a slideshow</p>
      <div className="w-[400px] border shadow-xl rounded-md h-fit overflow-hidden relative mt-4 ">
        <input
          type="text"
          placeholder="Describe your project"
          className="h-12 w-full pr-10 pl-4 noFocus relative text-sm"
        />
        <button className="absolute top-1/2 right-4 -translate-y-1/2 bg-primary rounded-full flex items-center justify-center">
          <Icons.chevronRight className="h-6 w-6 text-muted" />
        </button>
      </div>
      <div className="mt-10 max-w-[800px] w-[80%] grid grid-cols-3 gap-10 h-[120px] ">
        <PresetCard displayedText="Create a detailed presentation for my 8th grade history class about the American Civil War" />
        <PresetCard displayedText="I want a fun slide show to teach my 5th grade students about reptiles" />
        <PresetCard displayedText="Create a presentation to help teach the uploaded text book pages" />
      </div>
    </div>
  );
};

export default CreateSteps;

const PresetCard = ({displayedText}: {displayedText: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<string>("64px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // When opened, get the full height of the content
      setHeight(`${contentRef.current.scrollHeight + 12}px`);
    } else {
      // When closed, set it to the initial height (collapsed state)
      setHeight("64px");
    }
  }, [isOpen]);

  return (
    <button
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`w-full flex gap-2 items-start rounded-lg p-2 bg-background/70 transition-all duration-500 overflow-hidden
        ${isOpen ? "shadow-lg" : ""}
        `}
      style={{height}} // Dynamically change the button's height
    >
      <Icons.sparkles
        style={{height: "16px", width: "16px"}}
        className="mt-[4px] text-primary"
      />

      <div
        ref={contentRef}
        className={`text-left ${
          isOpen ? "h-fit" : "presentCard-content-closed"
        }`}
      >
        {displayedText}
      </div>
    </button>
  );
};
