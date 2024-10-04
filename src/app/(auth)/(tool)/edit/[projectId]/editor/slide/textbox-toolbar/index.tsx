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
import {TextColor2} from "./text-color";

import {usePresentation} from "@/context/presentation-context";
import {ColorMenu} from "./color-menu";

export const TextBoxToolBar = () => {
  const {selectedTextBox, mode} = usePresentation()!;

  type ToolMode = "color" | "default";

  const toolMode: ToolMode = "default";
  const colorCommand = (color: string) => {
    return color;
  };

  return (
    <div className="h-full  relative z-[50]">
      <div
        className={`flex-grow h-full  gap-4 flex flex-col items-center p-4  bg-background blurBack  border rounded-md relative  z-[40]
          ${mode === "default" ? "opacity-1" : "fade-out-500"}
          `}
      >
        {toolMode === "default" && (
          <>
            <div className="flex flex-col">
              <Label className="font-bold text-lg w-full">Edit</Label>
              <p className="text-sm text-muted-foreground">
                Make changes to you presentation by selecting a text box or an
                image
              </p>
            </div>
            <ToolbarRow label="Font">
              <FontSelector />
            </ToolbarRow>
            <ToolbarRow label="Size">
              <FontSize />
            </ToolbarRow>
            <ToolbarRow label="Text Color">
              <TextColor2 />
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
            <ToolbarRow label="Background">
              <BackgroundColor />
            </ToolbarRow>
          </>
        )}
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
      <h1 className="text-muted-foreground text-base w-full ">{label}</h1>

      {children}
    </div>
  );
};
