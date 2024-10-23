"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";

import {Label} from "@/components/ui/label";

import {TextAlign2} from "./text-align";
import {FontSelector} from "./font-selector";
import {List, List2} from "./list";
import {Strikethrough} from "./strike";
import {Underline} from "./underline";
import {Bold} from "./bold";
import {Italicize} from "./italicize";
import {BackgroundColor} from "./background-color";
import {FontSize} from "./font-size";
import {TextColor} from "./text-color";
import {BorderSize} from "./shape-border-size";
import {ShapeColor} from "./shape-color";
import {ShapeBorderColor} from "./shape-border-color";
import {usePresentation} from "@/context/presentation-context";
import {ColorMenu} from "./color-menu";
import {BackgroundImage} from "./background-image";
import Slide from "..";

export const TextBoxToolBar = ({
  shouldHideToolbar,
}: {
  shouldHideToolbar: boolean;
}) => {
  const {mode, activeEdit, selectedSlide} = usePresentation()!;

  const textIsSelected = selectedSlide?.textBoxes?.some(
    (textBox) => textBox.textBoxId === activeEdit
  );
  const imageIsSelected = selectedSlide?.images?.some(
    (image) => image.imageId === activeEdit
  );
  const shapeIsSelected = selectedSlide?.shapes?.some(
    (shape) => shape.shapeId === activeEdit
  );

  const isBackground = activeEdit === "background";

  return (
    <div className="h-full w-full md:w-[300px]  relative z-[50]">
      <div
        className={`flex-grow h-full  gap-4 flex flex-col items-center p-4  bg-background   border rounded-md relative  z-[40]
           ${
             shouldHideToolbar
               ? mode === "default"
                 ? "opacity-1"
                 : "fade-out-500"
               : "opacity-1"
           } 
          `}
      >
        <>
          {/* <div className="flex flex-col">
            <Label className="font-bold poppins-bold text-lg w-full">
              Edit
            </Label>
            <p className="text-sm text-muted-foreground poppins-regular">
              Make changes to you presentation by selecting a text box or an
              image
            </p>
          </div> */}
          {textIsSelected && (
            <>
              <div className="flex gap-3 flex-col w-full">
                <h1 className="w-full poppins-bold">Text</h1>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
              <ToolbarRow label="Font">
                <FontSelector />
              </ToolbarRow>
              <ToolbarRow label="Size">
                <FontSize />
              </ToolbarRow>
              <ToolbarRow label="Text Color">
                <TextColor />
              </ToolbarRow>
              <div className="grid grid-cols-4 w-full gap-2">
                <Bold />
                <Italicize />
                <Underline />
                <Strikethrough />
              </div>
              <ToolbarRow label="Align">
                <TextAlign2 />
              </ToolbarRow>
              <ToolbarRow label="List">
                <List2 />
              </ToolbarRow>
            </>
          )}
          {shapeIsSelected && (
            <>
              <div className="flex gap-3 flex-col w-full">
                <h1 className="w-full poppins-bold">Shape</h1>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>

              <ToolbarRow label="Fill Color">
                <ShapeColor />
              </ToolbarRow>
              <ToolbarRow label="Border Color">
                <ShapeBorderColor />
              </ToolbarRow>
              <ToolbarRow label="Border size">
                <BorderSize />
              </ToolbarRow>
            </>
          )}
          {isBackground && (
            <>
              <div className="flex gap-3 flex-col w-full">
                <h1 className="w-full poppins-bold">Background</h1>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
              <ToolbarRow label="Color">
                <BackgroundColor />
              </ToolbarRow>
              <ToolbarRow label="Image">
                <BackgroundImage />
              </ToolbarRow>
            </>
          )}
        </>
      </div>
    </div>
  );
};

const ToolbarRow = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-2 justify-between w-full">
      <h1 className="text-muted-foreground text-sm w-full poppins-regular ">
        {label}
      </h1>

      {children}
    </div>
  );
};
