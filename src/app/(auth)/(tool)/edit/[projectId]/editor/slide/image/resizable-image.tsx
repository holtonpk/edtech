import React, {useEffect, useRef, useState} from "react";
import {SlideImage} from "@/config/data";
import {useImage} from "@/context/image-context";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";

export const ResizableImage = ({children}: {children: React.ReactNode}) => {
  const {
    size,
    setSize,
    position,
    setPosition,
    rotation,
    activeDrag,
    activeTransform,
    isRotating,
  } = useImage()!;

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

          setSize({
            width: size.width + Math.round(deltaX),
          });
          break;
        case "nw":
          const scale1 = (size.width - deltaX) / size.width;
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
    [size, setSize, position, setPosition]
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
      className=" origin-center  absolute z-10 p-2"
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
