import React from "react";
import {Icons} from "@/components/icons";

import ActionButton from "./action-button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {usePresentation} from "@/context/presentation-context";
import {useTextBox} from "@/context/textbox-context";
const Options = () => {
  const {bringToFront, sendToBack} = usePresentation()!;
  const {deleteTextBox, duplicateTextBox, textBoxId} = useTextBox()!;

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <ActionButton
          onClick={() => setOpen(!open)}
          className={`nodrag nodrag2 hover:bg-theme-purple/30  p-2 text-theme-purple 
            ${open ? "bg-theme-purple/30" : ""}
            
            `}
        >
          <Icons.ellipsis className="h-4 w-4" />
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-[200px] flex flex-col p-0 overflow-hidden py-2 poppins-regular text-sm"
      >
        <button
          onClick={() => {
            duplicateTextBox();
            setOpen(false);
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.duplicate className="h-4 w-4 mr-2" />
          Duplicate
        </button>
        <button
          onClick={() => {
            setOpen(false);
            deleteTextBox();
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.trash className="h-4 w-4 mr-2" />
          Delete
        </button>
        <button
          onClick={() => {
            setOpen(false);

            sendToBack(textBoxId);
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.sendToBack className="h-4 w-4 mr-2" />
          Send to back
        </button>
        <button
          onClick={() => {
            setOpen(false);

            bringToFront(textBoxId);
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.bringToFront className="h-4 w-4 mr-2" />
          Bring to front
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default Options;
