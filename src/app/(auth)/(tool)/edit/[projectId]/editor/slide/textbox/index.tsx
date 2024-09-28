"use client";
import React, {useEffect, useState, useRef, useCallback} from "react";
import Draggable from "react-draggable";
import {ResizableBox} from "./resizable-box";
import {usePresentation} from "@/context/presentation-context";
import {useTextBox} from "@/context/textbox-context";
import TextboxActions from "./textbox-actions";
import {Icons} from "@/components/icons";
import {AiRewrite} from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/textbox-actions/ai-rewrite";
const TextBox = () => {
  const {
    textBoxState,
    text,
    size,
    position,
    setPosition,
    textBoxRef,
    textBoxText,
    rotation,
    fontSize,
    activeDrag,
    setActiveDrag,
    setIsSelected,
    isSelected,
    textBox,
    deleteTextBox,
    isRotating,
    activeTransform,
    setActiveTransform,
  } = useTextBox()!;

  const {
    setActiveEdit,
    activeEdit,
    activeDragGlobal,
    setActiveDragGlobal,
    updateData,
    copyTextBox,
    cutTextBox,
    pasteTextBox,
    mode,
    groupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
  } = usePresentation()!;

  useEffect(() => {
    setActiveDragGlobal(activeDrag);
  }, [activeDrag, setActiveDragGlobal]);

  useEffect(() => {
    const handleMouseUp = (e: any) => {
      setActiveDrag(false);
    };
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setActiveDrag]);

  const handleDrag = (e: any, ui: any) => {
    setActiveDrag(true);
    setActiveTransform(true);
    if (activeEdit !== textBoxState.textBoxId) {
      setActiveEdit(undefined);
    }

    const {x, y} = position;

    const isCenteredX = checkIfCenteredHorizontallyContainer(x + ui.deltaX);
    const isCenteredY = checkIfCenteredVerticallyContainer(y + ui.deltaY);

    let newX = x + ui.deltaX;
    let newY = y + ui.deltaY;

    if (isCenteredX.centered) {
      newX = isCenteredX.centerPoint;
    }

    if (isCenteredY.centered) {
      newY = isCenteredY.centerPoint;
    }

    setPosition({x: newX, y: newY});
  };

  const checkIfCenteredHorizontallyContainer = (x: number) => {
    const halfX = size.width / 2;
    const centerX = x + halfX;

    const containerWidth =
      document.getElementById("slide-container")?.clientWidth || 0;

    if (
      centerX + 4 > Math.round(containerWidth / 2) &&
      centerX - 4 < Math.round(containerWidth / 2)
    ) {
      setIsCenteredX(true);
      const centerPoint = Math.round(containerWidth / 2) - halfX;
      return {centered: true, centerPoint: centerPoint};
    } else {
      setIsCenteredX(false);
      return {centered: false, centerPoint: Math.round(containerWidth / 2)};
    }
  };

  const checkIfCenteredVerticallyContainer = (y: number) => {
    const containerHeight =
      document.getElementById("slide-container")?.clientHeight || 0;

    const boxHeight = textBoxRef.current?.clientHeight || 0;

    const halfY = boxHeight / 2;
    const centerY = y + halfY;

    if (
      centerY + 4 > Math.round(containerHeight / 2) &&
      centerY - 4 < Math.round(containerHeight / 2)
    ) {
      setIsCenteredY(true);
      const centerPoint = Math.round(containerHeight / 2) - halfY;
      return {centered: true, centerPoint: centerPoint};
    } else {
      setIsCenteredY(false);
      return {centered: false, centerPoint: Math.round(containerHeight / 2)};
    }
  };

  useEffect(() => {
    // listen for delete key
    const handleKeyDown = (e: KeyboardEvent) => {
      // if textBoxRef is being edited, don't delete the text box. determine this by checking if the carrot is visible
      const selection = window.getSelection();

      const disableTextboxListeners =
        e.target instanceof Element
          ? e.target.classList.contains("disableTextboxListeners")
          : false;

      if (disableTextboxListeners) return;

      if (selection?.focusNode?.nodeName !== "#text") {
        if (e.key === "Backspace" && isSelected) {
          deleteTextBox();
        }
        if (e.metaKey && e.key === "c") {
          copyTextBox();
        }
        if (e.metaKey && e.key === "x") {
          cutTextBox();
        }
        if (e.metaKey && e.key === "v") {
          pasteTextBox();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, deleteTextBox, copyTextBox, cutTextBox, pasteTextBox]);

  const [isCenteredX, setIsCenteredX] = React.useState<boolean>(false);
  const [isCenteredY, setIsCenteredY] = React.useState<boolean>(false);

  const textBoxPlaceholderRef = useRef<HTMLDivElement>(null);

  const updateTextBoxText = () => {
    if (textBoxRef.current?.innerHTML)
      textBoxText.current = textBoxRef.current?.innerHTML;
    // set inner html of textBoxPlaceholderRef to textBoxRef innerHTML
    textBoxPlaceholderRef.current!.innerHTML =
      textBoxRef.current?.innerHTML || "";
  };

  useEffect(() => {
    if (!activeTransform) {
      updateData(
        {
          position: {x: position.x, y: position.y},
          size: {width: size.width},
          fontSize: fontSize,
          rotation: rotation,
        },
        textBox.textBoxId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTransform]);

  const [openAiMenu, setOpenAiMenu] = React.useState(true);

  return (
    <>
      <div className={` ${isSelected ? "z-20" : ""}`}>
        <Draggable
          cancel=".nodrag"
          disabled={mode === "aiRewrite"}
          onDrag={handleDrag}
          position={position}
          onStop={() => {
            setActiveEdit(textBoxState.textBoxId);
            setActiveTransform(false);
            setActiveGroupSelectedTextBoxes(undefined);
          }}
        >
          <div
            id={`ui-text-box-${textBoxState.textBoxId}`}
            className=" absolute z-10 origin-center pointer-events-none group select-none "
            style={{
              width: size.width,
              height: "fit-content",
              cursor: activeDrag ? "move" : "pointer",
            }}
          >
            <div
              ref={textBoxPlaceholderRef}
              className="h-fit w-full relative  whitespace-pre-wrap break-words overflow-hidden pointer-events-auto "
              dangerouslySetInnerHTML={{__html: text}}
              style={{
                fontSize,
                visibility: isSelected ? "hidden" : "visible",
              }}
              onClick={() => {
                setActiveEdit(textBoxState.textBoxId);
                setIsSelected(true);
                setActiveGroupSelectedTextBoxes(undefined);
              }}
            />
            {!isSelected && !activeDragGlobal && (
              <div
                className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px] 
                  ${
                    groupSelectedTextBoxes?.includes(textBoxState.textBoxId)
                      ? "block"
                      : "hidden group-hover:block"
                  }
                  `}
              />
            )}
            {mode !== "aiRewrite" && <TextboxActions />}

            {isRotating && (
              <div className="bg-black rounded-md border shadow-sm absolute p-2 text-white  left-1/2 -translate-x-1/2 -bottom-20 translate-y-full w-[50px] flex items-center justify-center">
                {rotation}°
              </div>
            )}
          </div>
        </Draggable>
        {isSelected && (
          <>
            {mode !== "aiRewrite" && (
              <ResizableBox>
                <div
                  onInput={updateTextBoxText}
                  ref={textBoxRef}
                  className="h-fit w-full z-[50] relative nodrag whitespace-pre-wrap break-words overflow-hidden"
                  id={`text-box-${textBoxState.textBoxId}`}
                  dangerouslySetInnerHTML={{__html: text}}
                  style={{fontSize}}
                  contentEditable={true}
                />
              </ResizableBox>
            )}
            {mode === "aiRewrite" && (
              <div
                className="absolute"
                style={{
                  top: position.y,
                  left: position.x,
                  height: "fit-content",
                  width: size.width,
                  transform: `rotate(${rotation}deg)`,
                  fontSize: `${fontSize}px`,
                }}
              >
                <div
                  onInput={updateTextBoxText}
                  ref={textBoxRef}
                  className="h-fit w-full z-[50]  relative nodrag  whitespace-pre-wrap break-words overflow-hidden"
                  id={`text-box-${textBoxState.textBoxId}`}
                  dangerouslySetInnerHTML={{__html: text}}
                  contentEditable={true}
                />
                <div
                  className={`absolute bg-primary/10  border-2 border-primary top-0 left-0 h-full w-full z-[60] pointer-events-none rounded-[3px]  flex items-center justify-center `}
                >
                  {/* <div className="absolute bottom-0 right-0 bg-primary/70 blurBack text-base flex items-center font-bold text-background px-3 py-1 rounded-tl-md">
                    <Icons.check className="h-5 w-5 mr-2" />
                    Selected
                  </div> */}
                </div>
              </div>
            )}
          </>
        )}

        {}
      </div>

      {activeDrag && isCenteredX && (
        <div className="h-full border-dashed border border-primary absolute pointer-events-none left-1/2 -translate-x-1/2"></div>
      )}
      {activeDrag && isCenteredY && (
        <div className="w-full border-dashed border border-primary absolute pointer-events-none top-1/2 -translate-y-1/2"></div>
      )}
    </>
  );
};

export default TextBox;
