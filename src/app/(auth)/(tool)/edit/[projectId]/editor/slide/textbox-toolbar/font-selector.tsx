"use client";
import React, {useEffect} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import googleFonts from "@/public/fonts/fonts.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {applyCommand} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {TextBoxesToUpdate} from "@/config/data";

export const FontSelector = () => {
  const {
    activeEdit,
    updateData,
    groupSelectedTextBoxes,
    updateMultipleTextBoxes,
    slideData,
  } = usePresentation()!;

  const [fonts, setFonts] = React.useState<string[]>(googleFonts.fonts);
  const [selectedFont, setSelectedFont] = React.useState<string>(fonts[0]);

  const onSelectChange = (commandValue: string) => {
    if (activeEdit) {
      applyCommand(activeEdit, "fontName", commandValue);
      setSelectedFont(commandValue);
      const newText = document.getElementById(
        `text-box-${activeEdit}`
      )?.innerHTML;
      updateData({text: newText}, activeEdit);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        applyCommand(textBoxId, "fontName", commandValue);
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        textBoxesToUpdate.push({value: {text: newText}, textBoxId});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (activeEdit) {
      // find the face value of selectedTextBox.text
      const textBoxElement = document.getElementById(
        `ui-focus-text-box-${activeEdit}`
      );
      // get first font child of textBoxElement
      const fontNode = textBoxElement?.childNodes[0]
        .childNodes[0] as HTMLElement;
      console.log("fontNode:", fontNode);

      const nodeFont = fontNode?.getAttribute("face");

      setSelectedFont(nodeFont ? nodeFont : fonts[0]);
      setOriginalFont(nodeFont ? nodeFont : fonts[0]);
    } else if (groupSelectedTextBoxes) {
      const selectedFonts = new Set<string>();

      groupSelectedTextBoxes.forEach((textBoxId) => {
        const textBoxElement = document.getElementById(
          `ui-focus-text-box-${textBoxId}`
        );
        if (textBoxElement) {
          // Get the first font child of textBoxElement
          const fontNode = textBoxElement.childNodes[0]
            .childNodes[0] as HTMLElement;
          const nodeFont = fontNode.getAttribute("face");

          if (nodeFont) {
            selectedFonts.add(nodeFont); // Add the font to the Set
          } else {
            selectedFonts.add("Default");
          }
        }
      });

      if (selectedFonts.size > 1) {
        setSelectedFont("Multiple fonts");
      } else if (selectedFonts.size === 1) {
        setSelectedFont(Array.from(selectedFonts)[0]); // Extract the single font
      } else {
        setSelectedFont(fonts[0]); // Optional: Handle case where no fonts are found
      }
    }
  }, [activeEdit, groupSelectedTextBoxes]);

  const [value, setValue] = React.useState("");

  type DocumentFont = {
    font: string;
    usageId: string;
  };

  const [originalFont, setOriginalFont] = React.useState<string>("");

  const [clickedFont, setClickedFont] = React.useState<string | undefined>();

  const documentFonts =
    slideData?.slides.flatMap((slide) => {
      return slide.textBoxes.flatMap((textBox) => {
        const element = document.getElementById(
          `mini-slide-textbox-${textBox.textBoxId}`
        );
        if (!element) return []; // Return an empty array to skip this iteration

        const paragraph = element.querySelector("p");
        if (!paragraph) return []; // Skip this if no paragraph is found

        const fontTag = paragraph.querySelector("font");
        const font = fontTag?.getAttribute("face") || "Default";

        return [{font, usageId: textBox.textBoxId}]; // Return an array with the object
      });
    }) ?? []; // Ensure `documentFonts` is an empty array if `slideData` is undefined

  const suggestChangeAll =
    clickedFont &&
    documentFonts.some((font) => font.font === originalFont) &&
    clickedFont !== originalFont;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex-grow justify-between"
              >
                {selectedFont}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Font</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent align="start" className="w-[300px] p-0">
        <Command value={selectedFont} onValueChange={setSelectedFont}>
          <CommandInput
            placeholder="Search for a font"
            className="disableTextboxListeners disableSelector"
          />
          <CommandList>
            {/* <CommandEmpty>Change font</CommandEmpty> */}
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  style={{fontFamily: font}}
                  key={font}
                  value={font}
                  className="text-lg"
                  onSelect={(currentValue) => {
                    setClickedFont(currentValue);
                    onSelectChange(currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {font}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        {suggestChangeAll && (
          <div className="w-full  h-[60px]  overflow-hidden absolute bottom-0 left-0 bg-background ">
            <div className="slide-top absolute top-0 border-t  bg-background rounded-b-md h-fit w-full flex items-center  py-2 px-2 justify-between">
              <Button
              // onClick={() => {
              //   changeAllCommand(originalColor);
              //   setOriginalColor(color);
              // }}
              >
                Change all
              </Button>
              <div className="flex items-center gap-0 w-fit max-w-full mx-auto overflow-hidden">
                <div
                  style={{fontFamily: originalFont}}
                  className="text-[10px] whitespace-nowrap text-ellipsis leading-[12px]"
                  // style={{background: originalColor}}
                >
                  {originalFont}
                </div>
                <Icons.chevronRight className="h-3 w-3" />
                <div
                  className="text-[10px] whitespace-nowrap text-ellipsis leading-[12px]"
                  style={{fontFamily: selectedFont}}

                  // style={{background: color}}
                >
                  {selectedFont}
                </div>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
