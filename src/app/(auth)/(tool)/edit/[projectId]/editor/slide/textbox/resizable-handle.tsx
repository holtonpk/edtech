import React, {forwardRef, useCallback, useRef} from "react";
import {useTextBox} from "@/context/textbox-context";

const ResizableHandle = forwardRef<
  HTMLDivElement,
  {
    handleAxis: string;
    innerRef: React.Ref<HTMLDivElement>;
    hidden: boolean;
    onResize: (handleAxis: string, deltaX: number) => void;
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

  const {setActiveTransform} = useTextBox()!;

  const startDragPos = useRef({x: 0, y: 0});

  const handleRef = (node: HTMLDivElement | null) => {
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
    if (typeof innerRef === "function") {
      innerRef(node);
    } else if (innerRef) {
      (innerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
    }
  };

  const handleResize = useCallback(
    (e: MouseEvent) => {
      const {clientX} = e;
      const deltaX = clientX - startDragPos.current.x;
      onResize(handleAxis, deltaX);
    },
    [handleAxis, onResize]
  );

  const onMouseUp = useCallback(() => {
    console.log("mouse up");
    setActiveTransform(false);
    setActiveHandle(undefined);
    window.removeEventListener("mousemove", handleResize); // Ensure cleanup
  }, [setActiveTransform, setActiveHandle, handleResize]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      console.log("mouse down");
      startDragPos.current = {x: e.clientX, y: e.clientY};
      setActiveTransform(true);
      setActiveHandle(handleAxis);
      e.preventDefault();
      window.addEventListener("mousemove", handleResize);

      window.addEventListener("mouseup", onMouseUp, {once: true});
    },
    [handleResize, setActiveTransform, handleAxis, onMouseUp, setActiveHandle]
  );

  return (
    <>
      {!hidden && (
        <div
          onMouseDown={onMouseDown}
          ref={handleRef}
          className={`absolute ${getHandleClass(
            handleAxis
          )} react-resizable-handle nodrag nodrag2 z-30 bg-background border border-foreground/30 shadow-lg rounded-full ${
            activeHandle === handleAxis
              ? "bg-primary"
              : "hover:bg-primary bg-background"
          }`}
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
      return "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    case "w":
      return "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    default:
      return "";
  }
}

ResizableHandle.displayName = "ResizableHandle";

export default ResizableHandle;
