import React from "react";
import {Icons} from "@/components/icons";
import {useShape} from "@/context/shape-context";
import ActionButton from "./action-button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {usePresentation} from "@/context/presentation-context";
const Options = () => {
  const {bringToFront, sendToBack} = usePresentation()!;
  const {deleteShape, duplicateShape, shapeState} = useShape()!;

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <ActionButton
          onClick={() => setOpen(!open)}
          className={`nodrag hover:bg-theme-purple/30  p-2 text-theme-purple 
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
            setOpen(false);
            duplicateShape();
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.duplicate className="h-4 w-4 mr-2" />
          Duplicate
        </button>
        <button
          onClick={() => {
            setOpen(false);
            deleteShape();
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.trash className="h-4 w-4 mr-2" />
          Delete
        </button>
        <button
          onClick={() => {
            setOpen(false);

            sendToBack(shapeState.shapeId);
          }}
          className="w-full p-2 px-4 hover:bg-muted flex items-center "
        >
          <Icons.sendToBack className="h-4 w-4 mr-2" />
          Send to back
        </button>
        <button
          onClick={() => {
            setOpen(false);

            bringToFront(shapeState.shapeId);
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
