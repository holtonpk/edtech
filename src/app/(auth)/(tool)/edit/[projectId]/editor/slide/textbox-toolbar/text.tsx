import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {Label} from "@/components/ui/label";
import {usePresentation} from "@/context/presentation-context";
import {Position} from "@/config/data";

export const Text = () => {
  const [open, setOpen] = React.useState(false);

  const {
    slideData,
    selectedSlide,
    setSlideData,
    setActiveEdit,
    selectedTextBox,
    textColor,
  } = usePresentation()!;

  const createNewTextBox = (
    fontSize: number,
    text: string,
    position: Position
  ) => {
    if (slideData && selectedSlide) {
      const textBoxId = Math.random().toString();
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              textBoxes: [
                ...slide.textBoxes,
                {
                  text,
                  position,
                  size: {
                    width: 600,
                  },
                  rotation: 0,
                  textBoxId,
                  fontSize,
                },
              ],
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      setActiveEdit(textBoxId);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className={`flex-col transition-colors duration-200 ${
                  open ? "text-primary bg-accent" : ""
                }`}
              >
                <Icons.text className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a textbox</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4 w-full">
          {/* <h1 className="font-bold text-lg">Text </h1> */}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                createNewTextBox(
                  24,
                  `<p><font color="${textColor}">Add text here</font></p>`,
                  {x: 20, y: 100}
                );
                setOpen(false);
              }}
            >
              <Icons.text className="h-4 w-4 mr-2" />
              Add a text box
            </Button>
            <Button variant={"outline"}>
              <Icons.magicWand className="h-4 w-4 mr-2" />
              AI Magic Write
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Default Text Styles</Label>

            <Button
              onClick={() => {
                createNewTextBox(
                  40,
                  `<p><b><font color="${textColor}">Add heading here</font></p></b>`,
                  {
                    x: 20,
                    y: 20,
                  }
                );
                setOpen(false);
              }}
              variant={"outline"}
              className="text-2xl text-left justify-start py-4 font-bold"
            >
              Add a heading
            </Button>
            <Button
              onClick={() => {
                createNewTextBox(
                  24,
                  `<p><font color="${textColor}">Add subheading here</font></p>`,
                  {
                    x: 20,
                    y: 100,
                  }
                );
                setOpen(false);
              }}
              variant={"outline"}
              className="text-lg text-left justify-start py-2"
            >
              Add a subheading
            </Button>
            <Button
              onClick={() => {
                createNewTextBox(
                  16,
                  `<p><font color="${textColor}">Add body text here</font></p>`,
                  {
                    x: 20,
                    y: 100,
                  }
                );
                setOpen(false);
              }}
              variant={"outline"}
              className="text-sm text-left justify-start py-1"
            >
              Add a body text
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
