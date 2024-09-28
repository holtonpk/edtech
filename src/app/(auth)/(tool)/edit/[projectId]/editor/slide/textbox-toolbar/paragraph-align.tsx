"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";

import {applyCommand} from "@/lib/utils";

export const ParagraphAlign = () => {
  const {selectedTextBox} = usePresentation()!;

  const execCommand = (command: string) => {
    if (!selectedTextBox) return;
    applyCommand(selectedTextBox?.textBoxId, command, "true");
  };
  return (
    <div className="grid grid-cols-4 divide-x divide-border items-center border rounded-lg">
      <Button
        onClick={() => execCommand("justifyLeft")}
        variant={"ghost"}
        className="rounded-none"
      >
        <Icons.alignLeft className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => execCommand("justifyCenter")}
        variant={"ghost"}
        className="rounded-none"
      >
        <Icons.alignCenter className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => execCommand("justifyRight")}
        variant={"ghost"}
        className="rounded-none"
      >
        <Icons.alignRight className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => execCommand("justifyFull")}
        variant={"ghost"}
        className="rounded-none"
      >
        <Icons.alignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
};
