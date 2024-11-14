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
import {usePresentation} from "@/context/presentation-context-basic";
import Share from "./share";
import {LinkButton} from "@/components/ui/link";
const ToolBar = () => {
  const {slideData, title, setTitle} = usePresentation()!;

  return (
    <div className="w-full px-2 pt-2 h-[68px] relative z-30  ">
      <div className="h-[60px] w-full p-4  flex items-center justify-between  border rounded-md bg-background relative z-[40]">
        {/* <div className="absolute w-full h-[1px] bg-red-600 top-1/2 -translate-y-1/2 left-0"></div> */}
        <LinkButton
          href={"/dashboard"}
          className="flex gap-2 items-center  hover:bg-transparent p-0 bg-transparent"
        >
          <div className="flex gap-2 items-center ">
            <Icons.logo className="w-6 h-6 text-primary" />

            <h1 className="font-bold text-black flex items-center gap-[2px] text-xl poppins-bold leading-[20px] mt-1 ">
              Frizzle
              <span className="text-primary">.ai</span>
            </h1>
          </div>
        </LinkButton>
        <div className="flex w-fit items-center">
          <LinkButton
            href={"/dashboard"}
            className="flex gap-1 items-center text-muted-foreground ml-4 hover:text-primary p-0 bg-transparent hover:bg-transparent"
          >
            {/* <Icons.dash className="w-4 h-4  " /> */}
            <span className="poppins-regular text-base">Dashboard</span>
          </LinkButton>
          <Icons.chevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="w-fit relative   h-[24px]">
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger className="disableTextboxListeners">
                  <div className="w-fit invisible pr-12 text-base rounded-[4px]">
                    {title}
                  </div>
                  <input
                    placeholder="give your presentation a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base  text-primary top-0 left-0 overflow-hidden text-ellipsis disableSelector poppins-bold h-fit p-0 absolute rounded-[4px] px-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Project title</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center px-0  gap-4   ">
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
