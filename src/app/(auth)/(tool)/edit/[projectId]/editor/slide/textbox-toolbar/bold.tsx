"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {applyCommand} from "@/lib/utils";

export const Bold = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  const execCommand = () => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, "bold", "true");
    const newText = document.getElementById(
      `text-box-${selectedTextBox.textBoxId}`
    )?.innerHTML;
    updateData({text: newText}, selectedTextBox.textBoxId);
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            onClick={execCommand}
            className="px-2 bg-background border  w-full"
          >
            <Icons.bold className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
