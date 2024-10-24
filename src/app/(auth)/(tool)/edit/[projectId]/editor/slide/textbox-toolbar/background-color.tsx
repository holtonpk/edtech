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
import {DocumentColor} from "@/config/data";
import {TextBoxesToUpdate} from "@/config/data";

export const BackgroundColor = () => {
  const {slideData, selectedSlide, setSlideData, addRecentColor, slideDataRef} =
    usePresentation()!;

  const [selectedColor, setSelectedColor] = React.useState<string>(
    selectedSlide?.background || "#ffffff"
  );

  useEffect(() => {
    setSelectedColor(selectedSlide?.background || "#ffffff");
  }, [selectedSlide]);

  const setBackgroundCommand = (color: string) => {
    if (slideData && selectedSlide) {
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              background: color,
              backgroundImage: {
                path: "undefined",
                title: "undefined",
              },
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

  const documentColors = slideData?.slides.map((slide) => ({
    usageId: slide.id,
    color: slide.background,
  }));

  const changeMultiBackgroundColors = () => {
    if (slideDataRef.current) {
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
          return {
            ...slide,
            background: selectedColor,
            backgroundImage: {
              path: "undefined",
              title: "undefined",
            },
          };
        }),
      };
      setSlideData(updatedSlideData);
    }
  };

  const [originalColor, setOriginalColor] =
    React.useState<string>(selectedColor);

  useEffect(() => {
    setOriginalColor(selectedColor);
  }, [openMenu]);

  const suggestChangeAll = selectedColor !== originalColor;

  const ChangeAllMenu = (
    <div className="slide-top absolute top-0 border-t  bg-background rounded-b-md h-fit w-full flex items-center  py-2 px-2 justify-between">
      <Button
        className="w-full"
        onClick={() => {
          changeMultiBackgroundColors();
          setOriginalColor(selectedColor);
        }}
      >
        Apply to all
      </Button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 text-lg  h-10 w-fit ml-auto bg-background border rounded-md  items-center relative gap-2 overflow-hidden">
      <Popover open={openMenu} onOpenChange={setOpenMenu}>
        <PopoverTrigger>
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <button
                  className={`w-full h-10 flex justify-center items-center bg-background  px-2 py-1
                  ${openMenu ? "bg-muted" : "hover:bg-muted"}
                  `}
                >
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
          align="end"
          side="left"
          className="w-[250px] bg-background/90 blurBack p-0"
        >
          <ColorMenu
            colorCommand={setBackgroundCommand}
            currentColor={selectedColor}
            documentColors={documentColors as DocumentColor[]}
            suggestChangeAll={suggestChangeAll}
            ChangeAllMenu={ChangeAllMenu}
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
      <OpacityInput />
    </div>
  );
};

const OpacityInput = () => {
  const {slideData, selectedSlide, setSlideData} = usePresentation()!;

  const getOpacityOfSelected = () => {
    // If a single text box is selected
    return selectedSlide?.backgroundOpacity
      ? selectedSlide?.backgroundOpacity * 100 + "%"
      : "100%";
    // Default return value if no selection or other cases
  };

  const [opacity, setOpacity] = React.useState(getOpacityOfSelected());
  const opacityInputRef = React.useRef<HTMLInputElement>(null);

  const opacityOnSubmit = () => {
    if (!opacityInputRef.current) return;
    let numberValue = parseInt(opacityInputRef.current!.value.split("%")[0]);
    // max 100, min 0

    if (isNaN(numberValue)) {
      opacityInputRef.current!.value = opacity + "%";
      return;
    }

    if (numberValue > 100) numberValue = 100;
    if (numberValue < 0) numberValue = 0;

    const opacityValue = numberValue / 100;

    configOpacityCommand(opacityValue);

    setOpacity(JSON.stringify(numberValue));
    opacityInputRef.current!.value = numberValue + "%";
  };

  useEffect(() => {
    setOpacity(getOpacityOfSelected());
    opacityInputRef.current!.value = getOpacityOfSelected();
  }, [selectedSlide]);

  const configOpacityCommand = (value: number) => {
    setOpacity(JSON.stringify(value));
    if (slideData && selectedSlide) {
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              backgroundOpacity: value,
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
    }
  };

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!opacityInputRef.current) return;
        opacityInputRef.current.blur();
      }
    };
    if (!opacityInputRef.current) return;
    opacityInputRef.current.addEventListener("keyup", handleKeyUp);
    return () => {
      if (!opacityInputRef.current) return;
      opacityInputRef.current.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <input
            ref={opacityInputRef}
            onBlur={opacityOnSubmit}
            defaultValue={opacity}
            onFocus={() => {
              // selecet all text on focus
              setTimeout(() => {
                opacityInputRef.current?.select();
              }, 120);
            }}
            className="disableTextboxListeners text-sm text-center noFocus w-[50px] h-10 hover:bg-muted"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Background opacity</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
