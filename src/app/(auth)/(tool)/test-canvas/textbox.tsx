"use client";
import React, {useState, useRef, useCallback, forwardRef} from "react";
import {usePresentation} from "@/context/presentation-context";
import {TextBoxProvider, useTextBox} from "./textbox-context";
import {TextBoxType} from "@/config/data";

const Textbox = () => {
  const [size, setSize] = useState({width: 400});
  const [text, setText] = useState(
    "Refine, enhance, and tailor your content quicker than ever before.s"
  );

  const textBox = {
    position: {x: 100, y: 100},
    size,
    fontSize: 16,
    text,
    textBoxId: "1",
    rotation: 0,
  };

  return (
    <TextBoxProvider textBox={textBox}>
      <TextBoxCore />
    </TextBoxProvider>
  );
};

export default Textbox;

const TextBoxCore = () => {
  const {text, fontSize, textBox} = useTextBox()!;
  const [position, setPosition] = useState<{
    left: number;
    top: number | undefined;
    bottom: number | undefined;
  }>({left: 250, top: undefined, bottom: 200});

  return (
    <ResizableBox
      disabled={false}
      position={position}
      setPosition={setPosition}
    >
      <div
        className="h-fit w-full z-[50] relative nodrag whitespace-pre-wrap break-words overflow-hidden "
        id={`text-box-${textBox.textBoxId}`}
        dangerouslySetInnerHTML={{__html: text}}
        style={{
          fontSize,
          padding: ".05in .1in .05in .1in",
        }}
        contentEditable={true}
      />
    </ResizableBox>
  );
};

export const ResizableBox = ({
  children,
  disabled,
  position,
  setPosition,
}: {
  children: React.ReactNode;
  disabled: boolean;
  position: {left: number; top: number | undefined; bottom: number | undefined};
  setPosition: React.Dispatch<
    React.SetStateAction<{
      left: number;
      top: number | undefined;
      bottom: number | undefined;
    }>
  >;
}) => {
  const {
    size,
    setSize,
    // position,
    // setPosition,
    rotation,
    fontSize,
    setFontSize,
    activeDrag,
    activeTransform,
    isRotating,
    textBoxId,
    textBoxText,
    textBoxRef,
    textBox,
  } = useTextBox()!;

  const scaleHandles = ["se", "sw", "ne", "nw"];

  const handleRef = React.useRef<HTMLDivElement>(null);

  const isScaling = React.useRef<boolean>(false);

  const controlScale = React.useCallback(
    (handleAxis: string, deltaX: number) => {
      if (textBoxRef.current) {
        textBoxRef.current.blur();
      }
      const element = document.getElementById(`text-box-${textBoxId}`);
      const currentHeight = element?.getBoundingClientRect().height || 0;

      switch (handleAxis) {
        case "se":
          setSize({
            width: size.width + deltaX,
          });

          setFontSize(fontSize * ((size.width + deltaX) / size.width));

          break;

        case "sw":
          setPosition({
            top: position.top,
            left: position.left + deltaX,
            bottom: undefined,
          });
          setSize({
            width: size.width - deltaX,
          });
          setFontSize(fontSize * ((size.width - deltaX) / size.width));

          break;

        case "ne":
          const parentRect = document
            .getElementById("slide-container")
            ?.getBoundingClientRect().bottom;
          const bottom = element?.getBoundingClientRect().bottom;

          if (bottom && parentRect) {
            console.log("c bottom ====", bottom);
            console.log("p bottom ====", parentRect);
            console.log("bottom ====", parentRect - bottom);
            setPosition({
              top: undefined,
              left: position.left,
              bottom: bottom - parentRect,
            });
          }
          setSize({
            width: size.width + deltaX,
          });

          setFontSize(fontSize * ((size.width + deltaX) / size.width));

          break;
        case "nw":
          setPosition({
            top: position.top,
            left: position.left + deltaX,
            bottom: undefined,
          });
          setSize({
            width: size.width - deltaX,
          });
          setFontSize(fontSize * ((size.width - deltaX) / size.width));

          break;
        default:
          break;
      }
      isScaling.current = false;
    },
    [size, setSize, fontSize, position, setPosition, setFontSize]
  );

  // used to style active scale handles
  const [activeScaleHandle, setActiveScaleHandle] = useState<
    string | undefined
  >(undefined);

  return (
    <div
      ref={handleRef}
      className="nodrag origin-center  absolute z-10"
      style={{
        width: size.width,
        height: "fit-content",
        left: position.left,
        // top: position.top,
        bottom: position.bottom,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px]`}
      />

      {!disabled && (
        <>
          {scaleHandles.map((handleAxis) => (
            <ScaleHandle
              key={handleAxis}
              handleAxis={handleAxis}
              hidden={
                activeDrag ||
                (activeTransform && activeScaleHandle !== handleAxis)
              }
              controlScale={controlScale}
              activeHandle={activeScaleHandle}
              setActiveHandle={setActiveScaleHandle}
            />
          ))}
        </>
      )}
      <div className="z-10 relative">{children}</div>
    </div>
  );
};

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
  const {setActiveTransform} = useTextBox()!;
  const startDragPos = useRef({x: 0, y: 0});

  const isMouseDownRef = useRef(false); // Track if mouse is down
  const calculateScale = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      const {clientX, clientY} = e;
      const {x, y} = startDragPos.current;

      const deltaX = clientX - x;
      const deltaY = clientY - y;
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
      startDragPos.current = {x: e.clientX, y: e.clientY};

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
