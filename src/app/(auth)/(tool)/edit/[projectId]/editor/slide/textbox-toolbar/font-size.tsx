"use client";
import React, {useEffect} from "react";
import {usePresentation} from "@/context/presentation-context";
import {Slider} from "@/components/ui/slider";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {TextBoxesToUpdate} from "@/config/data";

export const FontSize = () => {
  const {
    selectedTextBox,
    selectedSlide,
    slideData,
    setSlideData,
    updateData,
    groupSelectedTextBoxes,
    updateMultipleTextBoxes,
  } = usePresentation()!;

  const selectButton = React.useRef<HTMLButtonElement>(null);

  const [popoverSize, setPopoverSize] = React.useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    // get width of the select button
    if (selectButton.current) {
      const width = selectButton.current.clientWidth;
      setPopoverSize(width);
    }
  }, [selectButton]);

  const presetFontSizes = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36];

  const [fontSize, setFontSize] = React.useState<number | undefined>(
    selectedTextBox
      ? selectedTextBox?.fontSize
      : groupSelectedTextBoxes
      ? undefined
      : 16
  );

  useEffect(() => {
    if (selectedTextBox) {
      setFontSize(selectedTextBox.fontSize);
    } else if (groupSelectedTextBoxes) {
      setFontSize(undefined);
    }
  }, [selectedTextBox, groupSelectedTextBoxes]);

  const [openMenu, setOpenMenu] = React.useState(false);

  // round to tenths
  const displayValue = fontSize ? Math.round(fontSize * 10) / 10 : undefined;

  const updateFontSize = (value: number) => {
    if (selectedTextBox) {
      setFontSize(value);
      updateData({fontSize: value}, selectedTextBox.textBoxId);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];

      groupSelectedTextBoxes.forEach((textBoxId) => {
        textBoxesToUpdate.push({textBoxId, value: {fontSize: value}});
      });
      setFontSize(value);
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

  const sliderChange = (value: number[]) => {
    if (!selectedTextBox && !groupSelectedTextBoxes) return;
    updateFontSize(value[0]);
  };

  const fontSizeInput = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    document
      .getElementById("font-size-input")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          fontSizeInput.current!.blur();
        }
      });

    return () => {
      document
        .getElementById("font-size-input")
        ?.removeEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            updateFontSize(fontSize || 16);
          }
        });
    };
  }, []);

  return (
    <div className="flex items-center w-full gap-2">
      <div className="border flex rounded-md  w-fit ">
        <div className="w-fit disableTextboxListeners relative">
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <>
                  <input
                    ref={fontSizeInput}
                    id="font-size-input"
                    onBlur={() => updateFontSize(fontSize || 16)}
                    value={displayValue}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="poppins-bold p-2 font-bold dark:bg-[#34323D] hover:bg-muted w-[60px] rounded-md text-center z-20 relative disableSelector disableTextboxListeners"
                    onFocus={() => setOpenMenu(true)}
                    placeholder="--"
                    type="number"
                  />
                </>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text Size</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Slider
        onValueChange={sliderChange}
        defaultValue={[33]}
        max={100}
        min={6}
        step={4}
        className="flex-grow"
      />
    </div>
  );
};
