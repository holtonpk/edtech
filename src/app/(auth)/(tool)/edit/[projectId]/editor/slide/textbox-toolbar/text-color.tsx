"use client";
import React, {useCallback, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
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
import {defaultShortColors} from "./color-menu";
import {TextBoxesToUpdate} from "@/config/data";

export const TextColor = () => {
  const {
    selectedTextBox,
    updateData,
    addRecentColor,
    textColor,
    setTextColor,
    groupSelectedTextBoxes,
  } = usePresentation()!;

  const textColorCommand = (commandValue: string) => {
    setTextColor(commandValue);
    if (selectedTextBox) {
      applyCommand(selectedTextBox?.textBoxId, "foreColor", commandValue);
      const newText = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      updateData({text: newText}, selectedTextBox.textBoxId);
      addRecentColor(commandValue);
    } else if (groupSelectedTextBoxes) {
      groupSelectedTextBoxes.forEach((textBoxId) => {
        applyCommand(textBoxId, "foreColor", commandValue);
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        updateData({text: newText}, textBoxId);
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className="relative text-lg p-2 border-none flex-col h-fit leading-[20px]"
              >
                A
                <div
                  className="aspect-square h-2 w-5 rounded-[4px] border"
                  style={{background: textColor}}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text Color</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit grid ">
        <h1 className="font-bold text-lg">Text Color</h1>
        <ColorMenu colorCommand={textColorCommand} currentColor={textColor} />
      </PopoverContent>
    </Popover>
  );
};

export const TextColor2 = () => {
  const {
    selectedTextBox,
    updateData,
    addRecentColor,
    textColor,
    setTextColor,
    groupSelectedTextBoxes,
    slideData,
    setSlideData,
    updateMultipleTextBoxes,
  } = usePresentation()!;

  const textColorCommand = (commandValue: string) => {
    setTextColor(commandValue);
    if (selectedTextBox) {
      applyColor(selectedTextBox?.textBoxId, commandValue);
      const newText = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      updateData({text: newText}, selectedTextBox.textBoxId);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        applyColor(textBoxId, commandValue);
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        textBoxesToUpdate.push({value: {text: newText}, textBoxId});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }

    addRecentColor(commandValue);
  };

  const applyColor = (textBoxId: string, color: string) => {
    // if text is highlighted, do not select text box content
    const element = document.getElementById(`text-box-${textBoxId}`);

    if (!element) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && selection.toString() !== "") {
      // Apply the color using execCommand
      document.execCommand("foreColor", false, color);
      setOpenMenu(true);
      return;
    } else {
      const paragraph = element.querySelector("p");
      if (!paragraph) return;
      const elementText = paragraph.innerHTML;
      const text = elementText.replaceAll(/<\/?font[^>]*>/g, "");
      const newText = `<font color="${color}">${text}</font>`;
      paragraph.innerHTML = newText;
      console.log("newText == ", paragraph.innerHTML);
    }
  };

  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <div className="relative  w-fit ml-auto">
      <div className="grid grid-cols-2 text-lg  h-10 w-fit ml-auto bg-background border rounded-md  items-center relative gap-2 overflow-hidden">
        <Popover open={openMenu} onOpenChange={setOpenMenu}>
          <PopoverTrigger>
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <button className="w-full h-10 flex justify-center items-center  hover:bg-muted px-2 py-1">
                    <div
                      style={{background: textColor}}
                      className="bg-background h-6 aspect-square rounded-full border overflow-hidden flex justify-center items-center mx-auto"
                    ></div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Text Color</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            className="w-[250px] bg-background/70 blurBack p-2"
          >
            <ColorMenu
              colorCommand={textColorCommand}
              currentColor={textColor}
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
                className="w-[50px] h-10 text-sm text-center noFocus"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Text Opacity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* {openMenu && (
        <div className="absolute bg-background blurBack3 border p-2 -left-4 -translate-x-full z-[60] -top-20  h-fit overflow-scroll rounded-md">
          <ColorMenu colorCommand={textColorCommand} currentColor={textColor} />
        </div>
      )} */}
    </div>
  );
};
