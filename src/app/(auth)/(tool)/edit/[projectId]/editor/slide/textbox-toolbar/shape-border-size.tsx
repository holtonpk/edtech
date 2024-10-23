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

export const BorderSize = () => {
  const {
    updateShapeData,
    selectedSlide,
    slideData,
    setSlideData,
    updateData,
    groupSelectedTextBoxes,
    updateMultipleTextBoxes,
    selectedShape,
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

  const [strokeSize, setStrokeSize] = React.useState<number | undefined>(
    selectedShape ? selectedShape?.strokeWidth : groupSelectedTextBoxes ? 0 : 0
  );

  useEffect(() => {
    if (selectedShape) {
      setStrokeSize(selectedShape.strokeWidth);
    } else if (groupSelectedTextBoxes) {
      setStrokeSize(undefined);
    }
  }, [selectedShape, groupSelectedTextBoxes]);

  const [openMenu, setOpenMenu] = React.useState(false);

  // round to tenths
  const displayValue = strokeSize
    ? Math.round(strokeSize * 10) / 10
    : undefined;

  const updateStrokeSize = (value: number) => {
    if (selectedShape) {
      setStrokeSize(value);
      updateShapeData({strokeWidth: value}, selectedShape.shapeId);
    }
  };

  const sliderChange = (value: number[]) => {
    if (!selectedShape) return;
    updateStrokeSize(value[0]);
  };

  const strokeSizeInput = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    document
      .getElementById("font-size-input")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          strokeSizeInput.current!.blur();
        }
      });

    return () => {
      document
        .getElementById("font-size-input")
        ?.removeEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            updateStrokeSize(strokeSize || 16);
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
                    ref={strokeSizeInput}
                    id="font-size-input"
                    onBlur={() => updateStrokeSize(strokeSize || 0)}
                    value={displayValue}
                    onChange={(e) => setStrokeSize(parseInt(e.target.value))}
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
        defaultValue={[strokeSize || 0]}
        max={30}
        min={0}
        step={0.5}
        className="flex-grow"
      />
    </div>
  );
};
