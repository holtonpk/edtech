import React, {forwardRef, useCallback, useRef} from "react";
import {useTextBox} from "@/context/textbox-context";

const ScaleHandle = ({
  handleAxis,
  hidden,
  controlScale,

  activeHandle,
  setActiveHandle,
}: {
  handleAxis: string;
  hidden: boolean;
  controlScale: (handleAxis: string, deltaX: number, deltaY: number) => void;
  activeHandle: string | undefined;
  setActiveHandle: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  // const {setActiveTransform} = useTextBox()!;

  const isMouseDownRef = useRef(false); // Track if mouse is down
  // const initialPositionRef = React.useRef({left: 0, top: 0});
  const startDragPos = useRef({x: 0, y: 0});

  const calculateScale = useCallback(
    (e: MouseEvent) => {
      const {clientX, clientY} = e;
      const {x, y} = startDragPos.current;

      const deltaX = clientX - x;
      const deltaY = clientY - y;
      controlScale(handleAxis, deltaX, deltaY);
      startDragPos.current = {x: clientX, y: startDragPos.current.y};
    },
    [handleAxis, controlScale]
  );

  const onMouseUp = useCallback(() => {
    // setActiveTransform(false);
    setActiveHandle(undefined);
    window.removeEventListener("mousemove", calculateScale); // Ensure cleanup
  }, [setActiveHandle, calculateScale]);
  // }, [setActiveTransform, setActiveHandle]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      console.log("mouse down");
      startDragPos.current = {x: e.clientX, y: e.clientY};

      setActiveHandle(handleAxis);
      e.preventDefault();
      window.addEventListener("mousemove", calculateScale);

      window.addEventListener("mouseup", onMouseUp, {once: true});
    },
    [calculateScale, handleAxis, onMouseUp, setActiveHandle]
  );

  return (
    <>
      {!hidden && (
        <div
          onMouseDown={onMouseDown}
          className={`absolute ${getHandleClass(
            handleAxis
          )} react-resizable-handle nodrag z-30  border border-foreground/30 shadow-lg rounded-full flex items-center justify-center group 
          ${
            activeHandle === handleAxis
              ? "bg-primary"
              : "hover:bg-primary bg-background"
          }
          
          `}
        >
          {/* <Icons.scale className="h-4 w-4 text-primary/60 group-hover:text-primary" /> */}
        </div>
      )}
    </>
  );
};

// Utility function to determine handle class based on axis
function getHandleClass(handleAxis: string): string {
  switch (handleAxis) {
    case "nw":
      return "top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-4 w-4 ";
    case "ne":
      return "top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 ";
    case "sw":
      return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 h-4 w-4 cursor-sw-resize";
    case "se":
      return "bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-4 w-4 cursor-se-resize";
    default:
      return "";
  }
}

export default ScaleHandle;
