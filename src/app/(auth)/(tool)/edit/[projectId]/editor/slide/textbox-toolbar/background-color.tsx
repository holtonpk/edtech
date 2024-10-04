"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {defaultShortColors} from "./color-menu";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import googleFonts from "@/public/fonts/fonts.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {ColorMenu} from "./color-menu";

export const BackgroundColor = () => {
  const {slideData, selectedSlide, setSlideData, addRecentColor} =
    usePresentation()!;

  const [selectedColor, setSelectedColor] = React.useState<string>(
    selectedSlide?.background || "#ffffff"
  );

  useEffect(() => {
    setSelectedColor(selectedSlide?.background || "#ffffff");
  }, [selectedSlide]);

  const textDefaultColors = [
    "#fff",
    "#000000",
    "#fed7d7",
    "#feebc8",
    "#c6f6d5",
    "#c3dafe",
  ];

  const setBackgroundCommand = (color: string) => {
    if (slideData && selectedSlide) {
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              background: color,
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      addRecentColor(color);
      setSelectedColor(color);
    }
  };
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <div className="grid grid-cols-2 text-lg  h-10 w-fit ml-auto bg-background border rounded-md  items-center relative gap-2 overflow-hidden">
      <Popover open={openMenu} onOpenChange={setOpenMenu}>
        <PopoverTrigger>
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <button className="w-full h-10 flex justify-center items-center bg-background hover:bg-muted px-2 py-1">
                  <div
                    style={{background: selectedColor}}
                    className="bg-background h-6 aspect-square rounded-full border overflow-hidden flex justify-center items-center mx-auto"
                  ></div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Background Color</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="w-[250px] bg-background/70 blurBack p-2"
        >
          <ColorMenu
            colorCommand={setBackgroundCommand}
            currentColor={selectedColor}
          />
          <button
            onClick={() => setOpenMenu(false)}
            className="absolute top-3 right-3"
          >
            <Icons.close className="h-4 w-4 hover:text-primary" />
          </button>
        </PopoverContent>
      </Popover>
      <div className="h-8 w-[2px] bg-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <input
              value={"100%"}
              type="percent"
              className="w-[50px] h-10  text-sm text-center  noFocus"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Background Opacity</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
