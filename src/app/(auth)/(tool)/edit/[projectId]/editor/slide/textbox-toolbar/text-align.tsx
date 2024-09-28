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

export const TextAlign = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  const execCommand = (command: string) => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, command, "true");
    const newText = document.getElementById(
      `text-box-${selectedTextBox.textBoxId}`
    )?.innerHTML;
    updateData({text: newText}, selectedTextBox.textBoxId);
  };

  const alignConfig = [
    {
      command: "justifyLeft",
      icon: <Icons.alignLeft className="h-5 w-5" />,
    },
    {
      command: "justifyCenter",
      icon: <Icons.alignCenter className="h-5 w-5" />,
    },
    {
      command: "justifyRight",
      icon: <Icons.alignRight className="h-5 w-5" />,
    },
    {
      command: "justifyFull",
      icon: <Icons.alignJustify className="h-5 w-5" />,
    },
  ];

  const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

  const clickHandler = () => {
    execCommand(alignConfig[(selectionIndex + 1) % alignConfig.length].command);
    setSelectionIndex((selectionIndex + 1) % alignConfig.length);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button onClick={clickHandler} variant={"ghost"} className="px-2">
            {alignConfig[selectionIndex].icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Alignment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const TextAlign2 = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  const execCommand = (command: string) => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, command, "true");
    const newText = document.getElementById(
      `text-box-${selectedTextBox.textBoxId}`
    )?.innerHTML;
    updateData({text: newText}, selectedTextBox.textBoxId);
  };

  const alignConfig = [
    {
      command: "justifyLeft",
      icon: <Icons.alignLeft className="h-5 w-5" />,
    },
    {
      command: "justifyCenter",
      icon: <Icons.alignCenter className="h-5 w-5" />,
    },
    {
      command: "justifyRight",
      icon: <Icons.alignRight className="h-5 w-5" />,
    },
    {
      command: "justifyFull",
      icon: <Icons.alignJustify className="h-5 w-5" />,
    },
  ];

  const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

  const clickHandler = () => {
    execCommand(alignConfig[(selectionIndex + 1) % alignConfig.length].command);
    setSelectionIndex((selectionIndex + 1) % alignConfig.length);
  };

  return (
    // <TooltipProvider>
    //   <Tooltip delayDuration={500}>
    //     <TooltipTrigger asChild>
    //       <Button onClick={clickHandler} variant={"ghost"} className="px-2">
    //         {alignConfig[selectionIndex].icon}
    //       </Button>
    //     </TooltipTrigger>
    //     <TooltipContent>
    //       <p>Alignment</p>
    //     </TooltipContent>
    //   </Tooltip>
    // </TooltipProvider>
    <div className="flex w-full bg-muted-foreground/10 rounded-md p-1">
      {alignConfig.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              execCommand(item.command);
              setSelectionIndex(index);
            }}
            className={` py-1 px-3 rounded-md  w-fit flex justify-center items-center
              ${selectionIndex === index ? "bg-background " : ""}
              `}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
};
