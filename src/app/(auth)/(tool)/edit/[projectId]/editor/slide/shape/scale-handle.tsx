import React, {forwardRef, useCallback, useRef} from "react";
import {useShape} from "@/context/shape-context";

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
  const {setActiveTransform} = useShape()!;
  const localRef = useRef<HTMLDivElement | null>(null);
  const isMouseDownRef = useRef(false); // Track if mouse is down
  const initialPositionRef = React.useRef({left: 0, top: 0});

  const calculateScale = useCallback(
    (e: MouseEvent) => {
      if (!localRef.current || !isMouseDownRef.current) return;

      const {clientX, clientY} = e;
      const {left, top} = initialPositionRef.current;

      const deltaX = clientX - left;
      const deltaY = clientY - top;
      controlScale(handleAxis, deltaX, deltaY);
    },
    [handleAxis, controlScale]
  );

  const onMouseUp = useCallback(() => {
    setActiveTransform(false);
    setActiveHandle(undefined);
  }, [setActiveTransform, setActiveHandle]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setActiveTransform(true);
      setActiveHandle(handleAxis);
      e.preventDefault();
      isMouseDownRef.current = true;
      // Capture the initial position of the element
      if (!localRef.current) return;
      const {left, top} = localRef.current.getBoundingClientRect();
      initialPositionRef.current = {left, top};

      window.addEventListener("mousemove", calculateScale);
      window.addEventListener(
        "mouseup",
        () => {
          isMouseDownRef.current = false;
          window.removeEventListener("mousemove", calculateScale);
          onMouseUp();
        },
        {once: true}
      );
    },
    [calculateScale, handleAxis, onMouseUp, setActiveHandle, setActiveTransform]
  );

  return (
    <>
      {!hidden && (
        <div
          onMouseDown={onMouseDown}
          ref={localRef}
          className={`absolute ${getHandleClass(
            handleAxis
          )} react-resizable-handle nodrag z-30  border border-foreground/30 shadow-lg rounded-full flex items-center justify-center group 
          ${
            activeHandle === handleAxis
              ? "bg-primary"
              : "hover:bg-primary bg-background"
          }
          
          `}
        />
      )}
    </>
  );
};

// Utility function to determine handle class based on axis
function getHandleClass(handleAxis: string): string {
  switch (handleAxis) {
    case "nw":
      return "top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-4 w-4 cursor-nw-resize";
    case "ne":
      return "top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 cursor-ne-resize";
    case "sw":
      return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 h-4 w-4 cursor-sw-resize";
    case "se":
      return "bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-4 w-4 cursor-se-resize";
    default:
      return "";
  }
}

export default ScaleHandle;
