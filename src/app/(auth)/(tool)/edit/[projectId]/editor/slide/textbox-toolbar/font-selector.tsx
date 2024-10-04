"use client";
import React, {useEffect} from "react";
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
      <PopoverContent className="w-[200px] p-0">
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
                  onSelect={(currentValue) => {
                    onSelectChange(currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    // setOpen(false);
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
      </PopoverContent>
    </Popover>
  );
};
