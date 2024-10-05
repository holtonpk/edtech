import React, {forwardRef, useCallback, useRef} from "react";
import {usePresentation} from "@/context/presentation-context";
import {useTextBox} from "@/context/textbox-context";
const ResizableHandle = forwardRef<
  HTMLDivElement,
  {
    handleAxis: string;
    innerRef: React.Ref<HTMLDivElement>;
    hidden: boolean;
    onResize: (handleAxis: string, deltaX: number, deltaY: number) => void;
    activeHandle: string | undefined;
    setActiveHandle: React.Dispatch<React.SetStateAction<string | undefined>>;
  }
>((props, ref) => {
  const {
    activeHandle,
    setActiveHandle,
    handleAxis,
    innerRef,
    hidden,
    onResize,
    ...restProps
  } = props;

  // const localRef = useRef<HTMLDivElement | null>(null);
  const startDragPos = useRef({x: 0, y: 0});

  const handleResize = useCallback(
    (e: MouseEvent) => {
      const {clientX} = e;
      const deltaX = clientX - startDragPos.current.x;
      const deltaY = clientX - startDragPos.current.y;
      onResize(handleAxis, deltaX, deltaY);
      startDragPos.current = {x: clientX, y: startDragPos.current.y};
    },
    [handleAxis, onResize]
  );

  const onMouseUp = useCallback(() => {
    console.log("mouse up");
    setActiveHandle(undefined);
    window.removeEventListener("mousemove", handleResize); // Ensure cleanup
  }, [setActiveHandle, handleResize]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startDragPos.current = {x: e.clientX, y: e.clientY};

      setActiveHandle(handleAxis);
      e.preventDefault();
      window.addEventListener("mousemove", handleResize);

      window.addEventListener("mouseup", onMouseUp, {once: true});
    },
    [handleResize, handleAxis, onMouseUp, setActiveHandle]
  );
  return (
    <>
      {!hidden && (
        <div
          onMouseDown={onMouseDown}
          // onMouseUp={onMouseUp}
          className={`absolute ${getHandleClass(
            handleAxis
          )} react-resizable-handle nodrag absolute z-[99] bg-background  border border-foreground/30 shadow-lg rounded-full 
          
          ${
            activeHandle === handleAxis
              ? "bg-primary"
              : "hover:bg-primary bg-background"
          }
          `}
          {...restProps}
        />
      )}
    </>
  );
});

// Utility function to determine handle class based on axis
function getHandleClass(handleAxis: string): string {
  switch (handleAxis) {
    case "e":
      return "top-1/2 -right-3 translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    case "w":
      return "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    case "n":
      return "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-6 cursor-ns-resize hover:bg-primary transition-colors duration-200";
    case "s":
      return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-3 w-6 cursor-ns-resize hover:bg-primary transition-colors duration-200";
    default:
      return "";
  }
}
ResizableHandle.displayName = "ResizableHandle";

export default ResizableHandle;
