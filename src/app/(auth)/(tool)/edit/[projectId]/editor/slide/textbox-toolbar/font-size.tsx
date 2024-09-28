"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Slider} from "@/components/ui/slider";
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

export const FontSize = () => {
  const {selectedTextBox, selectedSlide, slideData, setSlideData, updateData} =
    usePresentation()!;

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

  const [fontSize, setFontSize] = React.useState<number>(
    selectedTextBox?.fontSize || 16
  );

  useEffect(() => {
    if (selectedTextBox) {
      setFontSize(selectedTextBox.fontSize);
    }
  }, [selectedTextBox]);

  const [openMenu, setOpenMenu] = React.useState(false);

  // round to tenths
  const displayValue = Math.round(fontSize * 10) / 10;

  const updateFontSize = (value: number) => {
    if (!selectedTextBox) return;
    setFontSize(value);
    updateData({fontSize: value}, selectedTextBox.textBoxId);
  };

  const sliderChange = (value: number[]) => {
    if (!selectedTextBox) return;
    setFontSize(value[0]);
    updateData({fontSize: value[0]}, selectedTextBox.textBoxId);
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
            updateFontSize(fontSize);
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
                    onBlur={() => updateFontSize(fontSize)}
                    value={displayValue}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="p-2 font-bold dark:bg-[#34323D] hover:bg-muted w-[60px] rounded-md text-center z-20 relative disableSelector disableTextboxListeners"
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
