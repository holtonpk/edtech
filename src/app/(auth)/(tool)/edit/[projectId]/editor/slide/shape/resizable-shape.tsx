import React, {useEffect, useRef, useState} from "react";
import {SlideImage} from "@/config/data";
import {useImage} from "@/context/image-context";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import {useShape} from "@/context/shape-context";

export const ResizableShape = ({
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
  } = useShape()!;

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
            height: size.height * scale,
          });
          break;

        default:
          break;
      }
      isScaling.current = false;
    },
    [size, setSize, position, setPosition]
  );

  const controlResize = (
    handleAxis: string,
    deltaX: number,
    deltaY: number
  ) => {
    switch (handleAxis) {
      case "e":
        setSize({
          width: size.width + deltaX,
          height: size.height,
        });
        break;
      case "w":
        setPosition({
          y: position.y,
          x: position.x + deltaX,
        });
        setSize({
          width: size.width - deltaX,
          height: size.height,
        });
        break;
      case "n":
        setPosition({
          y: position.y + deltaY,
          x: position.x,
        });
        setSize({
          width: size.width,
          height: size.height - deltaY,
        });
        break;
      case "s":
        setSize({
          width: size.width,
          height: size.height + deltaY,
        });

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
        height: size.height,
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
          {resizeHandles.map((handleAxis) => (
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
          ))}
        </>
      )}
      <div className="z-0 h-full w-full">{children}</div>
    </div>
  );
};
