import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import React, {useState, useLayoutEffect, useRef, useEffect} from "react";
import {useTextBox} from "@/context/textbox-context";
import {usePresentation} from "@/context/presentation-context";

export const ResizableBox = ({
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
    fontSize,
    setFontSize,
    activeDrag,
    activeTransform,
    isRotating,
    textBoxId,
    textBoxText,
    textBoxRef,
  } = useTextBox()!;

  const {updateData} = usePresentation()!;

  const resizeHandles = ["e", "w"];
  const scaleHandles = ["se"];

  const handleRef = React.useRef<HTMLDivElement>(null);

  // const handleResize = React.useCallback(
  //   (handleAxis: string, deltaX: number) => {
  //     switch (handleAxis) {
  //       case "e":
  //         // console.log("handle", size.width + deltaX);
  //         setSize({
  //           width: size.width + deltaX,
  //         });
  //         break;
  //       case "w":
  //         setPosition({
  //           y: position.y,
  //           x: position.x + deltaX,
  //         });
  //         setSize({
  //           width: size.width - deltaX,
  //         });
  //         break;

  //       default:
  //         break;
  //     }
  //   },
  //   [size, position]
  // );

  const handleResize = (handleAxis: string, deltaX: number) => {
    if (textBoxRef.current) {
      textBoxRef.current.blur();
    }

    switch (handleAxis) {
      case "e":
        setSize({
          width: size.width + deltaX,
        });
        break;
      case "w":
        setPosition({
          y: position.y,
          x: position.x + deltaX,
        });
        setSize({
          width: size.width - deltaX,
        });
        break;

      default:
        break;
    }
  };

  const isScaling = React.useRef<boolean>(false);

  const controlScale = React.useCallback(
    (handleAxis: string, deltaX: number, deltaY: number) => {
      if (textBoxRef.current) {
        textBoxRef.current.blur();
      }
      switch (handleAxis) {
        case "se":
          const scale = (size.width + deltaX) / size.width;

          setSize({
            width: size.width + deltaX,
          });
          setFontSize(fontSize * scale);

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

      {!disabled && (
        <>
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
