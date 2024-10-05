import React, {useEffect, useRef, useState} from "react";
import {SlideImage} from "@/config/data";
import {useImage} from "@/context/image-context";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";

export const ResizableImage = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) => {
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

  const resizeHandles = ["e", "w", "n", "s"];
  const scaleHandles = ["se"];

  const handleRef = React.useRef<HTMLDivElement>(null);

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

  const [viewBox, setViewBox] = useState({
    width: 200,
    height: 150,
  });

  const controlResize = (
    handleAxis: string,
    deltaX: number,
    deltaY: number
  ) => {
    switch (handleAxis) {
      case "e":
        setViewBox({
          height: viewBox.height,
          width: viewBox.width + Math.round(deltaX),
        });
        break;
      case "w":
        setViewBox({
          height: viewBox.height,
          width: viewBox.width - Math.round(deltaX),
        });
        setPosition({
          x: position.x + deltaX,
          y: position.y,
        });
        break;
      case "n":
        setViewBox({
          height: viewBox.height - Math.round(deltaY),
          width: viewBox.width,
        });
        setPosition({
          x: position.x,
          y: position.y + deltaY,
        });
        break;
      case "s":
        setViewBox({
          height: viewBox.height + Math.round(deltaY),
          width: viewBox.width,
        });
        break;
      default:
        break;
    }
  };

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
      className=" origin-center absolute z-10 p-2  "
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
          {/* {resizeHandles.map((handleAxis) => (
            <ResizableHandle
              key={handleAxis}
              handleAxis={handleAxis}
              innerRef={handleRef}
              hidden={
                activeDrag ||
                (activeTransform && activeResizeHandle !== handleAxis)
              }
              onResize={controlResize}
              activeHandle={activeResizeHandle}
              setActiveHandle={setActiveResizeHandle}
            />
          ))} */}
        </>
      )}
      <div className="z-0 ">{children}</div>
    </div>
  );
};
