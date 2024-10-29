import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import React, {useState, useLayoutEffect, useRef, useEffect} from "react";
import {useTextBox} from "@/context/textbox-context";
import {usePresentation} from "@/context/presentation-context";
import TextboxActions from "./textbox-actions";
import Draggable from "react-draggable";
export const ResizableBox = ({
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
    fontSize,
    setFontSize,
    activeDrag,
    activeTransform,
    isRotating,
    textBoxId,
    textBoxText,
    textBoxRef,
    textBoxState,
    textBox,
    setActiveTransform,
  } = useTextBox()!;

  const {
    setActiveSlide,
    setActiveEdit,
    setActiveGroupSelectedTextBoxes,
    setGroupSelectedTextBoxes,
    activeGroupSelectedTextBoxes,
  } = usePresentation()!;

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

  const [activeTextEdit, setActiveTextEdit] = useState<boolean>(false);

  useEffect(() => {
    // focus on the text in the textbox when activeTextEdit is true
    if (activeTextEdit) {
      const element = document.getElementById(
        `text-box-${textBoxState.textBoxId}`
      );
      if (element) {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();

          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
    // document.getElementById(`text-box-${textBoxState.textBoxId}`)?.focus();
  }, [activeTextEdit]);

  return (
    <Draggable
      cancel=".nodrag2"
      onDrag={handleDrag}
      position={position}
      onStop={() => {
        setActiveSlide(undefined);
        setActiveEdit(textBox.textBoxId);
        setActiveTransform(false);
        setActiveGroupSelectedTextBoxes(undefined);
        setGroupSelectedTextBoxes(undefined);
      }}
    >
      <div
        ref={handleRef}
        className=" origin-center  absolute z-10"
        style={{
          width: size.width,
          height: "fit-content",

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
        <div
          onClick={() => {
            setActiveTextEdit(true);
          }}
          style={{opacity: activeTextEdit ? 1 : 0}}
          className={`z-10 relative nodrag2  `}
        >
          {children}
        </div>
        <TextboxActions />
      </div>
    </Draggable>
  );
};
