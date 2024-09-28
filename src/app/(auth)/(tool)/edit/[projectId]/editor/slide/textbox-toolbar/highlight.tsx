"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {CursorModes} from "@/config/data";
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
import {applyCommand} from "@/lib/utils";

export const Highlight = () => {
  const {selectedTextBox, updateData, addRecentColor} = usePresentation()!;

  const [selectedColor, setSelectedColor] = React.useState<string>("#ffffff");

  const highlightColorCommand = (commandValue: string) => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, "hiliteColor", commandValue);
    const newText = document.getElementById(
      `text-box-${selectedTextBox.textBoxId}`
    )?.innerHTML;
    updateData({text: newText}, selectedTextBox.textBoxId);
    setSelectedColor(commandValue);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Button variant={"ghost"} className="px-2 ">
                <Icons.highlighter className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Highlight Color</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit grid ">
        <h1 className="font-bold text-lg">Highlight Color</h1>
        <ColorMenu
          colorCommand={highlightColorCommand}
          currentColor={selectedColor}
        />
        <Button
          variant={"outline"}
          onClick={() => highlightColorCommand("transparent")}
          className="mt-1"
        >
          <Icons.colorReset className="h-5 w-5" />
          Transparent
        </Button>
      </PopoverContent>
    </Popover>
  );
};
