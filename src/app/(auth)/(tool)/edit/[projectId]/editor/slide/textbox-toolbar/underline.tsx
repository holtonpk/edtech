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
import {TextBoxesToUpdate} from "@/config/data";
import {determineIfActive} from "@/lib/utils";

export const Underline = () => {
  const {
    activeEdit,
    updateData,
    groupSelectedTextBoxes,
    updateMultipleTextBoxes,
  } = usePresentation()!;

  // const execCommand = () => {
  //   if (!selectedTextBox) return;
  //   applyCommand(selectedTextBox?.textBoxId, "underline", "true");
  //   const newText = document.getElementById(
  //     `text-box-${selectedTextBox.textBoxId}`
  //   )?.innerHTML;
  //   updateData({text: newText}, selectedTextBox.textBoxId);
  // };
  const execCommand = () => {
    setIsActive(!isActive);
    if (activeEdit) {
      applyCommand(activeEdit, "underline", "true");
      const newText = document.getElementById(
        `text-box-${activeEdit}`
      )?.innerHTML;
      updateData({text: newText}, activeEdit);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        if (!isActive && determineIfActive(textBoxId, "u")) return;
        applyCommand(textBoxId, "underline", "true");
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        textBoxesToUpdate.push({textBoxId, value: {text: newText}});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

  const [isActive, setIsActive] = React.useState<boolean>(false);

  useEffect(() => {
    if (activeEdit) {
      const active = determineIfActive(activeEdit, "u");
      setIsActive(active);
    } else if (groupSelectedTextBoxes) {
      let isActiveLocal = false;
      groupSelectedTextBoxes.forEach((textBoxId) => {
        isActiveLocal = isActiveLocal && determineIfActive(textBoxId, "u");
      });
      setIsActive(isActiveLocal);
    } else {
      setIsActive(false);
    }
  }, [activeEdit, groupSelectedTextBoxes]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Button
            variant={"ghost"}
            onClick={execCommand}
            className={`px-2  border  w-full
              ${
                isActive
                  ? "text-primary bg-muted hover:text-primary hover:bg-primary/20"
                  : "bg-background"
              }
              `}
          >
            <Icons.underline className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Underline</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
