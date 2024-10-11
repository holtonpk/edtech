"use client";
import React, {useEffect, useState, useRef, useCallback} from "react";
import Draggable from "react-draggable";
import {ResizableBox} from "./resizable-box";
import {usePresentation} from "@/context/presentation-context";
import {useTextBox} from "@/context/textbox-context";
import TextboxActions from "./textbox-actions";
import {Icons} from "@/components/icons";
import RotationDisplay from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/textbox-actions/rotation-display";

const TextBox = () => {
  const {
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
    copySelected,
    cutSelected,

    mode,
    groupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
    selectedTextBox,
    setGroupSelectedTextBoxes,
    selectedForAiWrite,
    setSelectedForAiWrite,
    setActiveSlide,
    activeSlide,
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
    if (activeEdit !== textBox.textBoxId) {
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
        if (selectedTextBox) {
          if (e.key === "Backspace" && isSelected) {
            deleteTextBox();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === "c") {
            console.log("copySelected ==========");
            copySelected();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === "x") {
            cutSelected();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, deleteTextBox, copySelected, cutSelected]);

  const [isCenteredX, setIsCenteredX] = React.useState<boolean>(false);
  const [isCenteredY, setIsCenteredY] = React.useState<boolean>(false);

  const textBoxPlaceholderRef = useRef<HTMLDivElement>(null);

  const updateTextBoxText = () => {
    if (textBoxRef.current?.innerHTML)
      if (textBoxRef.current?.innerHTML.includes("<font")) {
        textBoxText.current = textBoxRef.current?.innerHTML;
        textBoxPlaceholderRef.current!.innerHTML =
          textBoxRef.current?.innerHTML || "";
      } else {
        // insert font tag inside the <p> tag
        const newText = `<p><font>${textBoxRef.current?.innerText}</font></p>`;
        textBoxText.current = newText;
        textBoxPlaceholderRef.current!.innerHTML = newText;
      }

    // set inner html of textBoxPlaceholderRef to textBoxRef innerHTML
  };

  useEffect(() => {
    if (isFirstRender.current) return;
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, []);

  const isGroupSelected = groupSelectedTextBoxes
    ? groupSelectedTextBoxes?.includes(textBox.textBoxId)
    : false;

  const onBlur = () => {
    updateData({text: textBoxText.current}, textBox.textBoxId);
  };

  return (
    <>
      {mode !== "aiRewrite" ? (
        <>
          <div className={` relative ${isSelected ? "z-20" : "z-10"}`}>
            <Draggable
              cancel=".nodrag"
              // disabled={mode === "aiRewrite"}
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
                id={`ui-text-box-${textBox.textBoxId}`}
                className=" absolute z-10 origin-center pointer-events-none group select-none "
                style={{
                  width: size.width,
                  height: "fit-content",
                  cursor: activeDrag ? "move" : "pointer",
                }}
              >
                <div
                  ref={textBoxPlaceholderRef}
                  className="h-fit  w-full relative whitespace-pre-wrap break-words overflow-hidden pointer-events-auto "
                  dangerouslySetInnerHTML={{__html: text}}
                  id={`ui-focus-text-box-${textBox.textBoxId}`}
                  style={{
                    fontSize,
                    visibility: isSelected ? "hidden" : "visible",
                    transform: `rotate(${rotation}deg) `,
                    textAlign: textBox.textAlign ? textBox.textAlign : "left",
                    opacity: textBox?.textOpacity ? textBox.textOpacity : 1,
                  }}
                  onClick={() => {
                    setActiveEdit(textBox.textBoxId);

                    setActiveSlide(undefined);
                    setIsSelected(true);
                    setActiveGroupSelectedTextBoxes(undefined);
                  }}
                />
                {!isSelected && !activeDragGlobal && (
                  <div
                    className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px] hidden group-hover:block 

                  `}
                    style={{
                      transform: `rotate(${rotation}deg) `,
                    }}
                  />
                )}
                <TextboxActions />

                {isRotating && <RotationDisplay rotation={rotation} />}
              </div>
            </Draggable>

            {(isSelected || isGroupSelected) && (
              <>
                <ResizableBox disabled={isGroupSelected}>
                  <div
                    onBlur={onBlur}
                    onInput={updateTextBoxText}
                    ref={textBoxRef}
                    className="h-fit w-full z-[50] relative nodrag whitespace-pre-wrap break-words overflow-hidden "
                    id={`text-box-${textBox.textBoxId}`}
                    dangerouslySetInnerHTML={{__html: text}}
                    style={{
                      fontSize,
                      textAlign: textBox.textAlign ? textBox.textAlign : "left",
                      opacity: textBox?.textOpacity ? textBox.textOpacity : 1,
                    }}
                    contentEditable={true}
                  />
                </ResizableBox>
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
      ) : (
        <div
          onClick={() => {
            setActiveSlide(undefined);
            setActiveSlide(undefined);
            if (!selectedForAiWrite) return;
            if (selectedForAiWrite.includes(textBox.textBoxId)) {
              setSelectedForAiWrite(
                (prev) => prev && prev.filter((id) => id !== textBox.textBoxId)
              );
            } else {
              setSelectedForAiWrite((prev) =>
                prev ? [...prev, textBox.textBoxId] : [textBox.textBoxId]
              );
            }
          }}
          className="absolute group cursor-pointer"
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
            className="h-fit w-full z-[50]  relative nodrag  whitespace-pre-wrap break-words overflow-hidden pointer-events-none"
            dangerouslySetInnerHTML={{__html: text}}
          />

          <div
            className={`absolute    top-0 left-0 h-full w-full z-[60] pointer-events-none rounded-[3px]  flex items-center justify-center 
                ${
                  selectedForAiWrite &&
                  selectedForAiWrite.includes(textBox.textBoxId)
                    ? "bg-primary/10 border-2 border-primary"
                    : " group-hover:border-2 group-hover:border-primary"
                }
                `}
          >
            {selectedForAiWrite &&
              selectedForAiWrite.includes(textBox.textBoxId) && (
                <div className="absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 bg-primary blurBack text-[12px] whitespace-nowrap flex items-center font-bold text-background px-3 py-1  rounded-b-sm ">
                  <Icons.check className="h-4 w-4 mr-2" />
                  Selected for AI Write
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default TextBox;
