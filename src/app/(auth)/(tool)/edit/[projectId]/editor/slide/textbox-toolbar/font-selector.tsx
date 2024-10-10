"use client";
import React, {useEffect} from "react";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
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

  const onSelectChange = (newFont: string) => {
    if (activeEdit) {
      applyCommand(activeEdit, "fontName", newFont);
      const newText = document.getElementById(
        `text-box-${activeEdit}`
      )?.innerHTML;
      updateData({text: newText}, activeEdit);
    } else if (groupSelectedTextBoxes) {
      let textBoxesToUpdate: TextBoxesToUpdate[] = [];
      groupSelectedTextBoxes.forEach((textBoxId) => {
        applyCommand(textBoxId, "fontName", newFont);
        const newText = document.getElementById(
          `text-box-${textBoxId}`
        )?.innerHTML;
        textBoxesToUpdate.push({value: {text: newText}, textBoxId});
      });
      updateMultipleTextBoxes(textBoxesToUpdate);
    }
  };

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

  const changeAllCommand = () => {
    let textBoxesToUpdate: TextBoxesToUpdate[] = [];
    documentFonts.forEach((textBox) => {
      if (textBox.font === originalFont) {
        applyFontToNotSelected(textBox.usageId, selectedFont);
        const newText = document.getElementById(
          `mini-slide-textbox-${textBox.usageId}`
        )?.innerHTML;
        textBoxesToUpdate.push({
          value: {text: newText},
          textBoxId: textBox.usageId,
        });
      }
    });
    if (textBoxesToUpdate.length === 0) return;
    updateMultipleTextBoxes(textBoxesToUpdate);
  };

  const applyFontToNotSelected = (textBoxId: string, font: string) => {
    const element = document.getElementById(`mini-slide-textbox-${textBoxId}`);
    if (!element) return;
    const paragraph = element.querySelector("p");
    if (!paragraph) return;
    const fontTag = paragraph.querySelector("font");
    if (!fontTag) return;
    fontTag.face = font;
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

  type DocumentFont = {
    font: string;
    usageId: string;
  };

  const [originalFont, setOriginalFont] = React.useState<string>("");

  const suggestChangeAll =
    selectedFont &&
    selectedFont !== "Multiple fonts" &&
    selectedFont !== "Default" &&
    documentFonts.some((font) => font.font === originalFont) &&
    selectedFont !== originalFont;

  useEffect(() => {
    if (suggestChangeAll) {
      const colorTab = document.getElementById("font-container");
      const height = colorTab?.getBoundingClientRect().height;
      colorTab?.setAttribute("style", `height: ${height}px`);
      colorTab?.classList.add("pb-[64px]");
      colorTab?.classList.add("overflow-y-scroll");

      colorTab?.scrollTo(0, 0);
    } else {
      const colorTab = document.getElementById("font-container");
      colorTab?.setAttribute("style", `height: auto`);
      colorTab?.classList.remove("pb-[64px]");
      colorTab?.classList.remove("overflow-y-scroll");
    }
  }, [suggestChangeAll]);

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
      <PopoverContent
        align="start"
        className="w-[350px] p-0 overflow-hidden bg-background/90 blurBack"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3"
        >
          <Icons.close className="h-4 w-4 hover:text-primary" />
        </button>
        <h1 className="poppins-bold text-lg p-2 pb-1">Select a font</h1>
        <div
          id="font-container"
          className="h-fit p-2  grid grid-cols-2 items-center w-full pt-0 space-y-1 space-x-0"
        >
          {fonts.map((font) => (
            <button
              style={{fontFamily: font, fontWeight: 500}}
              key={font}
              className={`text-lg  border bg-background flex items-center w-[95%] rounded-[12px] py-1 whitespace-nowrap px-2 relative transition-colors duration-300
                 ${
                   selectedFont === font
                     ? "border-primary"
                     : "hover:border-primary/60 border-border"
                 }
                
                `}
              onClick={() => {
                setSelectedFont(font);
                onSelectChange(font);
                setOpen(true);
              }}
            >
              <Check
                className={cn(
                  "absolute h-4 w-4 right-2 text-primary",
                  selectedFont === font ? "opacity-100" : "opacity-0"
                )}
              />
              {font}
            </button>
          ))}
        </div>

        {suggestChangeAll && (
          <div className="w-full  h-[60px]  overflow-hidden absolute bottom-0 left-0 bg-background ">
            <div className="slide-top absolute top-0 border-t  bg-background rounded-b-md h-fit w-full flex items-center  py-2 px-2 justify-between">
              <Button
                onClick={() => {
                  changeAllCommand();
                  setOriginalFont(selectedFont);
                }}
              >
                Change all
              </Button>
              <div className="flex items-center gap-0 w-fit max-w-full mx-auto overflow-hidden">
                <div
                  style={{fontFamily: originalFont}}
                  className="text-sm whitespace-nowrap text-ellipsis leading-[12px]"
                  // style={{background: originalColor}}
                >
                  {originalFont}
                </div>
                <Icons.chevronRight className="h-3 w-3" />
                <div
                  className="text-sm whitespace-nowrap text-ellipsis leading-[12px]"
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
