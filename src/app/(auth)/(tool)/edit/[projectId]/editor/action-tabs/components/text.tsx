import React, {Children, useEffect, useRef} from "react";

import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";

import {Label} from "@/components/ui/label";
import {Modes, Position, Image as ImageType} from "@/config/data";

import TabContent from "./tab-content";

const Text = () => {
  const {
    selectedSlide,
    setSlideData,
    setActiveEdit,
    selectedTextBox,
    textColor,
    slideDataRef,
  } = usePresentation()!;

  const createNewTextBox = (
    fontSize: number,
    text: string,
    position: Position,
    boxType?: "heading" | "body"
  ) => {
    if (slideDataRef.current && selectedSlide) {
      const textBoxId = Math.random().toString();
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
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
                  ...(boxType && {boxType}),
                },
              ],
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      setTimeout(() => {
        setActiveEdit(textBoxId);
      }, 5);
    }
  };

  const calculateNewBoxPosition = () => {
    if (selectedTextBox) {
      const {x, y} = selectedTextBox.position;
      const textboxHeight =
        document
          .getElementById(`ui-text-box-${selectedTextBox.textBoxId}`)
          ?.getBoundingClientRect().height || 40;

      let yPos = y + 10 + textboxHeight;

      if (y + 10 + textboxHeight > 560) {
        yPos = y - 40;
      }

      if (yPos < 0) {
        yPos = 230;
      }

      const newBoxPosition = {x: x, y: yPos};
      return newBoxPosition;
    } else {
      return {x: 200, y: 230};
    }
  };

  return (
    <TabContent title="Text" description="Add text to your slides">
      <div className="flex flex-col gap-4 w-full mt-2  ">
        {/* <h1 className="font-bold text-lg">Text </h1> */}

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => {
              createNewTextBox(
                24,
                `<p><font color="${textColor}">Add text here</font></p>`,
                calculateNewBoxPosition()
              );
            }}
          >
            <Icons.text className="h-6 w-6 mr-2" />
            Add a text box
          </Button>
          <Button variant={"outline"}>
            <Icons.magicWand className="h-6 w-6 mr-2" />
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
                },
                "heading"
              );
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
                },
                "body"
              );
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
                },
                "body"
              );
            }}
            variant={"outline"}
            className="text-sm text-left justify-start py-1"
          >
            Add a body text
          </Button>
        </div>
      </div>
    </TabContent>
  );
};

export default Text;
