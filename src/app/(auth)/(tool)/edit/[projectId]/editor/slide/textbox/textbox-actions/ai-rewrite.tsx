import React from "react";
import ActionButton from "./action-button";
import {Icons} from "@/components/icons";
import {useTextBox} from "@/context/textbox-context";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
const AiRewriteButton = () => {
  const {textBoxState} = useTextBox()!;

  const [open, setOpen] = React.useState(true);

  return <V2 />;
};

export default AiRewriteButton;

export const V2 = () => {
  const {setMode} = usePresentation()!;
  return (
    <ActionButton
      className="p-2 nodrag  bg-theme-purple/30 text-theme-purple"
      onClick={() => setMode("aiRewrite")}
    >
      <Icons.magicWand className="h-3 w-3" />
      <p className="text-[12px] font-bold leading-[12px] whitespace-nowrap ">
        Ai Rewrite
      </p>
    </ActionButton>
  );
};

export const V1 = () => {
  const {selectedTextBox, setMode} = usePresentation()!;
  return (
    <div className="relative h-fit">
      <ActionButton
        onClick={() => setMode("aiRewrite")}
        className="p-[2px] nodrag relative bg-gradient-to-r from-indigo-600 to-rose-600"
      >
        <div className="h-full w-full bg-background text-indigo-600 flex  rounded-full p-2 items-center gap-1">
          <Icons.magicWand className="h-4 w-4" />
          <p className="text-[12px] leading-[12px] whitespace-nowrap">
            Ai Rewrite
          </p>
        </div>
      </ActionButton>
    </div>
  );
};

export const AiRewrite = () => {
  const {selectedTextBox, setMode} = usePresentation()!;

  return (
    <div className="w-[400px] bg-background p-2 rounded-md fixed z-50 left-1/2 -translate-x-1/2 text-base top-full translate-y-4 ">
      {/* <h1 className="font-bold text-xl">Version 1</h1> */}
      <div className="flex items-center justify-between  w-full mx-auto  ">
        <Icons.chevronLeft className="h-4 w-4" />1 of 3
        <Icons.chevronRight className="h-4 w-4" />
      </div>
      {/* <h1 className="font-bold text-xl"> Magic Rewrite</h1> */}

      <div
        className="h-[150px] p-2 overflow-scroll border rounded-md mt-4"
        dangerouslySetInnerHTML={{__html: selectedTextBox?.text || ""}}
      ></div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {/* <div className="col-span-2">
          <h1>Quick changes</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Length</Label>

          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Longer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Shorter</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Length</Label>

          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Longer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Shorter</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="col-span-2 grid grid-cols-[1fr_20px_1fr] gap-2 items-center">
          <div className="h-[1px] w-full bg-muted-foreground" />
          or
          <div className="h-[1px] w-full bg-muted-foreground" /> */}
        {/* </div> */}
        {/* <div className="col-span-2">
          <Textarea
            className="no-resize"
            placeholder="describe the change (ex. use a more fun playful tone)"
          ></Textarea>
        </div>
        <button
          // onClick={() => setOpen(false)}
          className="text-white bg-rose-600  rounded-md col-span-2 p-1"
        >
          <div className=" text-white rounded-md h-full px-4 py-2">
            Generate
          </div>
        </button> */}
        <Button className="col-span-2">Apply</Button>
      </div>
    </div>
  );
};
