"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import ProfileNav from "../../../components/profile-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Present from "./present";
import {Input} from "@/components/ui/input";
import {usePresentation} from "@/context/presentation-context";
import Share from "./share";
const ToolBar = () => {
  const {slideData, title, setTitle} = usePresentation()!;

  return (
    <div className="w-full px-2 pt-2 h-[68px] relative z-30 ">
      <div className="h-[60px] w-full py-2 flex items-center justify-between px-4 border rounded-md bg-background relative z-[40]">
        <div className="flex gap-2 items-center">
          <div className="bg-primary/20 rounded-[6px] p-1 aspect-square h-fit w-fit flex items-center justify-center">
            <Icons.wand className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-bold flex items-center gap-[2px] text-xl poppins-bold">
            Frizzle
            <span className="text-primary">.ai</span>
          </h1>
        </div>
        <div className=" items-center  gap-4 hidden md:flex">
          <Undo />
          {/* <div className="h-[30px] w-[1px] bg-black/60"></div> */}

          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger className="disableTextboxListeners">
                <Input
                  placeholder="give your project a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-96 overflow-hidden text-ellipsis disableSelector poppins-bold"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Project title</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <div className="h-[30px] w-[1px] bg-black/60"></div>s */}
          <SaveStatus />
        </div>
        <div className="flex items-center px-0 md:p-3 gap-4   ">
          <Share />
          <Present />

          {/* <ProfileNav /> */}
        </div>
      </div>
    </div>
  );
};

export default ToolBar;

const Undo = () => {
  const {
    history,
    setSlideData,
    historyIndex,
    setHistoryIndex,
    setSelectedSlide,
    selectedSlide,
    historyRef,
  } = usePresentation()!;

  const handleChangeIndex = (index: number) => {
    if (!historyRef.current) return;
    if (index < 0 || index >= historyRef.current.length) return;
    setHistoryIndex(index);
    setSlideData(historyRef.current[index]);
    if (
      !history[historyIndex + index].slides.find(
        (slide) => slide.id === selectedSlide?.id
      )
    ) {
      setSelectedSlide(history[historyIndex + index].slides[0]);
    }
  };

  return (
    <div className="flex  ">
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              disabled={historyIndex >= historyRef.current.length - 1}
              onClick={() => {
                handleChangeIndex(historyIndex + 1);
              }}
              variant={"ghost"}
              className="p-2"
            >
              <Icons.undo className="w-6 h-6 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center">
            Undo
            <div className="flex gap-1 mt-[2px]">
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                ⌘
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                Z
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              disabled={historyIndex == 0}
              onClick={() => {
                handleChangeIndex(historyIndex - 1);
              }}
            >
              <Icons.redo className="w-6 h-6 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center">
            Redo
            <div className="flex gap-1 mt-[2px]">
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                <Icons.shift className="w-[10px] h-[10px] " />
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                ⌘
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                Z
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const SaveStatus = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Icons.save className="w-6 h-6 opacity-60 text-black" />
        </TooltipTrigger>
        <TooltipContent>
          <p>All changes saved!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
