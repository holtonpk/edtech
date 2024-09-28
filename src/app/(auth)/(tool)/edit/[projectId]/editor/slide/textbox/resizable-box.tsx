import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import React, {useState, useLayoutEffect, useRef, useEffect} from "react";
import {useTextBox} from "@/context/textbox-context";

export const ResizableBox = ({children}: {children: React.ReactNode}) => {
  const {
    size,
    setSize,
    position,
    setPosition,
    rotation,
    fontSize,
    setFontSize,
    activeDrag,
    activeTransform,
    isRotating,
  } = useTextBox()!;

  const resizeHandles = ["e", "w"];
  const scaleHandles = ["se"];

  const handleRef = React.useRef<HTMLDivElement>(null);

  const handleResize = React.useCallback(
    (handleAxis: string, deltaX: number) => {
      switch (handleAxis) {
        case "e":
          setSize((prevSize) => ({
            width: prevSize.width + deltaX,
          }));
          break;
        case "w":
          setPosition((prevPosition) => ({
            y: prevPosition.y,
            x: prevPosition.x + deltaX,
          }));
          setSize((prevSize) => ({
            width: prevSize.width - deltaX,
          }));
          break;

        default:
          break;
      }
    },
    [setPosition, setSize]
  );

  const isScaling = React.useRef<boolean>(false);

  const controlScale = React.useCallback(
    (handleAxis: string, deltaX: number, deltaY: number) => {
      switch (handleAxis) {
        case "se":
          const scale = (size.width + deltaX) / size.width;

          setFontSize(fontSize * scale);
          setSize({
            width: size.width + Math.round(deltaX),
          });
          break;
        case "nw":
          const scale1 = (size.width - deltaX) / size.width;
          setFontSize(fontSize * scale1);
          setSize({
            width: size.width - Math.round(deltaX),
          });
          setPosition({
            x: position.y + deltaY,
            y: position.x + deltaX,
          });
          break;
        case "ne":
          const scale2 = (size.width + deltaX) / size.width;
          setFontSize(fontSize * scale2);
          setPosition({
            x: position.y + deltaY,
            y: position.x,
          });
          setSize({
            width: size.width + Math.round(deltaX),
          });
          break;
        case "sw":
          const scale3 = (size.width - deltaX) / size.width;
          setFontSize(fontSize * scale3);
          setSize({
            width: size.width - Math.round(deltaX),
          });
          setPosition({
            x: position.y,
            y: position.x + deltaX,
          });
          break;

        default:
          break;
      }
      isScaling.current = false;
    },
    [size, setSize, fontSize, position, setPosition, setFontSize]
  );

  // used to style active resize handles
  const [activeResizeHandle, setActiveResizeHandle] = useState<
    string | undefined
  >(undefined);

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
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px]`}
      />

      {resizeHandles.map((handleAxis) => (
        <ResizableHandle
          key={handleAxis}
          handleAxis={handleAxis}
          innerRef={handleRef}
          hidden={
            activeDrag ||
            isRotating ||
            (activeTransform && activeResizeHandle !== handleAxis)
          }
          onResize={handleResize}
          activeHandle={activeResizeHandle}
          setActiveHandle={setActiveResizeHandle}
        />
      ))}

      {scaleHandles.map((handleAxis) => (
        <ScaleHandle
          key={handleAxis}
          handleAxis={handleAxis}
          hidden={
            activeDrag || (activeTransform && activeScaleHandle !== handleAxis)
          }
          controlScale={controlScale}
          activeHandle={activeScaleHandle}
          setActiveHandle={setActiveScaleHandle}
        />
      ))}
      <div className="z-10 relative">{children}</div>
    </div>
  );
};
