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

  // const execCommand = (command: string) => {
  //   if (!selectedTextBox) return;
  //   applyCommand(selectedTextBox?.textBoxId, command, "true");
  //   const newText = document.getElementById(
  //     `text-box-${selectedTextBox.textBoxId}`
  //   )?.innerHTML;
  //   updateData({text: newText}, selectedTextBox.textBoxId);
  // };

  const execCommand = (command: string) => {
    if (activeEdit) {
      applyCommand(activeEdit, command, "true");
      const newText = document.getElementById(
        `text-box-${activeEdit}`
      )?.innerHTML;
      updateData({text: newText}, activeEdit);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        // if (!isActive && determineIfActive(textBoxId, "b")) return;
        applyCommand(textBoxId, command, "true");
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        textBoxesToUpdate.push({textBoxId, value: {text: newText}});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

  const determineTextAlignIndex = (textBoxId: string) => {
    const element = document.getElementById(`ui-focus-text-box-${textBoxId}`)
      ?.childNodes[0] as HTMLElement | null;

    const textAlign = element?.style.textAlign;
    if (textAlign === "left") {
      return 0;
    }
    if (textAlign === "center") {
      return 1;
    }
    if (textAlign === "right") {
      return 2;
    }
    if (textAlign === "justify") {
      return 3;
    }
    return 0;
  };

  useEffect(() => {
    if (activeEdit) {
      const active = determineTextAlignIndex(activeEdit);
      setSelectionIndex(active);
    } else if (groupSelectedTextBoxes) {
      const selectedTextAlign = new Set<number>();

      groupSelectedTextBoxes.forEach((textBoxId) => {
        selectedTextAlign.add(determineTextAlignIndex(textBoxId));
      });

      if (selectedTextAlign.size > 1) {
        setSelectionIndex(3);
      } else if (selectedTextAlign.size === 1) {
        setSelectionIndex(Array.from(selectedTextAlign)[0]);
      } else {
        setSelectionIndex(0);
      }
    } else {
      setSelectionIndex(0);
    }
  }, [activeEdit, groupSelectedTextBoxes]);

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

  // useEffect(() => {
  //   if (activeEdit) {
  //     const active = determineIfActive(activeEdit, "b");
  //     setIsActive(active);
  //   } else if (groupSelectedTextBoxes) {
  //     let isActiveLocal = true;
  //     groupSelectedTextBoxes.forEach((textBoxId) => {
  //       isActiveLocal = isActiveLocal && determineIfActive(textBoxId, "b");
  //     });
  //     setIsActive(isActiveLocal);
  //   } else {
  //     setIsActive(false);
  //   }
  // }, [activeEdit, groupSelectedTextBoxes]);

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

// export const TextAlign = () => {
//   const {selectedTextBox, updateData} = usePresentation()!;

//   const execCommand = (command: string) => {
//     if (!selectedTextBox) return;
//     applyCommand(selectedTextBox?.textBoxId, command, "true");
//     const newText = document.getElementById(
//       `text-box-${selectedTextBox.textBoxId}`
//     )?.innerHTML;
//     updateData({text: newText}, selectedTextBox.textBoxId);
//   };

//   const alignConfig = [
//     {
//       command: "justifyLeft",
//       icon: <Icons.alignLeft className="h-5 w-5" />,
//     },
//     {
//       command: "justifyCenter",
//       icon: <Icons.alignCenter className="h-5 w-5" />,
//     },
//     {
//       command: "justifyRight",
//       icon: <Icons.alignRight className="h-5 w-5" />,
//     },
//     {
//       command: "justifyFull",
//       icon: <Icons.alignJustify className="h-5 w-5" />,
//     },
//   ];

//   const [selectionIndex, setSelectionIndex] = React.useState<number>(0);

//   const clickHandler = () => {
//     execCommand(alignConfig[(selectionIndex + 1) % alignConfig.length].command);
//     setSelectionIndex((selectionIndex + 1) % alignConfig.length);
//   };

//   return (
//     <TooltipProvider>
//       <Tooltip delayDuration={500}>
//         <TooltipTrigger asChild>
//           <Button onClick={clickHandler} variant={"ghost"} className="px-2 ">
//             {alignConfig[selectionIndex].icon}
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Alignment</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// };
