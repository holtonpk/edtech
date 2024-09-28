"use client";
import React, {useEffect} from "react";
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
import {applyCommand} from "@/lib/utils";

export const List = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  function removeLists(html: string): string {
    // Create a temporary DOM element to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Function to unwrap the content of the list items
    function unwrapListElements(elements: NodeListOf<Element>) {
      elements.forEach((element) => {
        // Replace the element with its child nodes (preserving inner content)
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        // Remove the empty element
        element.remove();
      });
    }

    // Unwrap and remove <ul>, <ol>, and <li> elements
    unwrapListElements(doc.querySelectorAll("ul, ol, li"));

    // Return the modified HTML as a string
    return doc.body.innerHTML;
  }

  const execCommand = (command: string) => {
    if (!selectedTextBox) return;
    if (command === "removeList") {
      let html = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      // remove list from innerHTML
      if (!html) return;
      const newText = removeLists(html);
      updateData({text: newText}, selectedTextBox.textBoxId);
    } else {
      applyCommand(selectedTextBox?.textBoxId, command, "true");
      const newText = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      updateData({text: newText}, selectedTextBox.textBoxId);
    }
  };

  const listConfig = [
    {
      command: "insertOrderedList",
      icon: <Icons.orderedList className="h-5 w-5" />,
    },
    {
      command: "insertUnorderedList",
      icon: <Icons.bulletList className="h-5 w-5" />,
    },
    {
      command: "removeList",
      icon: <Icons.orderedList className="h-5 w-5" />,
    },
  ];

  const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

  const clickHandler = () => {
    execCommand(listConfig[selectionIndex % listConfig.length].command);
    setSelectionIndex((selectionIndex + 1) % listConfig.length);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button onClick={clickHandler} variant={"ghost"} className="px-2">
            {listConfig[selectionIndex].icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>List</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const List2 = () => {
  const {selectedTextBox, updateData} = usePresentation()!;

  function removeLists(html: string): string {
    // Create a temporary DOM element to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Function to unwrap the content of the list items
    function unwrapListElements(elements: NodeListOf<Element>) {
      elements.forEach((element) => {
        // Replace the element with its child nodes (preserving inner content)
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        // Remove the empty element
        element.remove();
      });
    }

    // Unwrap and remove <ul>, <ol>, and <li> elements
    unwrapListElements(doc.querySelectorAll("ul, ol, li"));

    // Return the modified HTML as a string
    return doc.body.innerHTML;
  }

  const execCommand = (command: string) => {
    if (!selectedTextBox) return;
    if (command === "removeList") {
      let html = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      // remove list from innerHTML
      if (!html) return;
      const newText = removeLists(html);
      updateData({text: newText}, selectedTextBox.textBoxId);
    } else {
      applyCommand(selectedTextBox?.textBoxId, command, "true");
      const newText = document.getElementById(
        `text-box-${selectedTextBox.textBoxId}`
      )?.innerHTML;
      updateData({text: newText}, selectedTextBox.textBoxId);
    }
  };

  const listConfig = [
    {
      command: "insertOrderedList",
      icon: <Icons.orderedList className="h-5 w-5" />,
    },
    {
      command: "insertUnorderedList",
      icon: <Icons.bulletList className="h-5 w-5" />,
    },
    {
      command: "removeList",
      icon: <Icons.orderedList className="h-5 w-5" />,
    },
  ];

  const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

  const clickHandler = () => {
    execCommand(listConfig[selectionIndex % listConfig.length].command);
    setSelectionIndex((selectionIndex + 1) % listConfig.length);
  };

  return (
    // <TooltipProvider>
    //   <Tooltip delayDuration={500}>
    //     <TooltipTrigger asChild>
    //       <Button onClick={clickHandler} variant={"ghost"} className="px-2">
    //         {listConfig[selectionIndex].icon}
    //       </Button>
    //     </TooltipTrigger>
    //     <TooltipContent>
    //       <p>List</p>
    //     </TooltipContent>
    //   </Tooltip>
    // </TooltipProvider>
    <div className="w-full justify-between flex rounded-md p-1 bg-muted-foreground/10">
      {listConfig.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            execCommand(item.command);
          }}
          className={`w-fit rounded-md py-1 px-3
            ${selectionIndex === index ? "bg-background " : ""}
            `}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};
