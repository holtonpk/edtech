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

export const TextAlign2 = () => {
  const {
    activeEdit,
    updateData,
    groupSelectedTextBoxes,
    updateMultipleTextBoxes,
    selectedTextBox,
  } = usePresentation()!;

  type AlignConfigType = {
    command: "left" | "center" | "right" | "justify";
    icon: JSX.Element;
  };

  const alignConfig: AlignConfigType[] = [
    {
      command: "left",
      icon: <Icons.alignLeft className="h-5 w-5" />,
    },
    {
      command: "center",
      icon: <Icons.alignCenter className="h-5 w-5" />,
    },
    {
      command: "right",
      icon: <Icons.alignRight className="h-5 w-5" />,
    },
    {
      command: "justify",
      icon: <Icons.alignJustify className="h-5 w-5" />,
    },
  ];

  const applyCommand = (command: "left" | "center" | "right" | "justify") => {
    if (activeEdit) {
      updateData({textAlign: command}, activeEdit);
    }
    if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        textBoxesToUpdate.push({textBoxId, value: {textAlign: command}});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

  const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

  return (
    <div className="flex w-full bg-muted-foreground/10 rounded-md p-1">
      {alignConfig.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              applyCommand(item.command);
              setSelectionIndex(index);
            }}
            className={` py-1 px-3 rounded-md  w-fit flex justify-center items-center
              ${
                selectedTextBox
                  ? selectedTextBox?.textAlign
                    ? selectedTextBox?.textAlign === item.command
                      ? "bg-background"
                      : "bg-transparent"
                    : item.command === "left"
                    ? "bg-background"
                    : "bg-transparent"
                  : index === selectionIndex
                  ? "bg-background"
                  : "bg-transparent"
              }
              `}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};
