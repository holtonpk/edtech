import React, {forwardRef, useCallback, useRef} from "react";
import {usePresentation} from "@/context/presentation-context";
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

  const localRef = useRef<HTMLDivElement | null>(null);

  // const {setActiveTransform} = useTextBox()!;

  const handleRef = (node: HTMLDivElement | null) => {
    localRef.current = node;

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
      const handleNode = localRef.current;
      if (!handleNode) return;

      const {clientX, clientY} = e;
      const {left} = handleNode.getBoundingClientRect();

      const deltaX = clientX - left;

      onResize(handleAxis, deltaX);
    },
    [handleAxis, onResize]
  );

  const onMouseUp = useCallback(() => {
    console.log("mouse up");
    // setActiveTransform(false);
    setActiveHandle(undefined);
  }, [setActiveHandle]);
  // }, [setActiveTransform, setActiveHandle]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // setActiveTransform(true);
      setActiveHandle(handleAxis);
      e.preventDefault();
      window.addEventListener("mousemove", handleResize);

      window.addEventListener(
        "mouseup",
        () => {
          window.removeEventListener("mousemove", handleResize);
          onMouseUp();
        },
        {once: true}
      );
    },
    // [handleResize, setActiveTransform, handleAxis, onMouseUp, setActiveHandle]
    [handleResize, handleAxis, onMouseUp, setActiveHandle]
  );

  return (
    <>
      {!hidden && (
        <div
          onMouseDown={onMouseDown}
          // onMouseUp={onMouseUp}
          ref={handleRef}
          className={`absolute ${getHandleClass(
            handleAxis
          )} react-resizable-handle nodrag  z-30 bg-background  border border-foreground/30 shadow-lg rounded-full 
          
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
      return "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    case "w":
      return "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-6 w-3 cursor-ew-resize hover:bg-primary transition-colors duration-200";
    default:
      return "";
  }
}
ResizableHandle.displayName = "ResizableHandle";

export default ResizableHandle;
