import React, {useEffect, useRef, useState} from "react";
import {SlideImage} from "@/config/data";
import {useImage} from "@/context/image-context";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import {useShape} from "@/context/shape-context";
import ShapeActions from "./shape-actions";
import Draggable from "react-draggable";

export const ResizableShape = ({
  children,
  disabled,
  handleDrag,
}: {
  children: React.ReactNode;
  disabled: boolean;
  handleDrag: (e: any, ui: any) => void;
}) => {
  const {
    size,
    setSize,
    position,
    setPosition,
    rotation,
    activeDrag,
    activeTransform,
    setActiveTransform,
    shapeState,
  } = useShape()!;

  const resizeHandles = ["e", "w", "n", "s"];
  const scaleHandles = ["se", "sw", "ne", "nw"];

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
      switch (handleAxis) {
        case "sw":
          const scale = (size.width - deltaX) / size.width;

          setPosition({
            x: position.x + deltaX,
            y: position.y,
          });
          setSize({
            width: size.width - Math.round(deltaX),
            height: size.height * scale,
          });
          break;

        default:
          break;
      }

      switch (handleAxis) {
        case "ne":
          const scale = (size.width + deltaX) / size.width;

          setPosition({
            x: position.x,
            y: position.y + (size.height - size.height * scale),
          });
          setSize({
            width: size.width + Math.round(deltaX),
            height: size.height * scale,
          });
          break;

        default:
          break;
      }

      switch (handleAxis) {
        case "nw":
          const scale = (size.width - deltaX) / size.width;

          setPosition({
            x: position.x + deltaX,
            y: position.y + (size.height - size.height * scale),
          });
          setSize({
            width: size.width - Math.round(deltaX),
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

  const {mode, setActiveEdit} = usePresentation()!;

  return (
    <Draggable
      cancel=".nodrag"
      disabled={mode === "aiRewrite"}
      onDrag={handleDrag}
      position={position}
      onStop={() => {
        setActiveEdit(shapeState.shapeId);
        setActiveTransform(false);
      }}
    >
      <div
        ref={handleRef}
        className=" origin-center absolute  z-20   "
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className="pointer-events-none "
          style={{width: size.width, height: size.height}}
        ></div>

        <div className="slide-box-border " />
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
        {/* <div className="z-0 h-full w-full  ">{children}</div> */}
        <ShapeActions />
      </div>
    </Draggable>
  );
};
