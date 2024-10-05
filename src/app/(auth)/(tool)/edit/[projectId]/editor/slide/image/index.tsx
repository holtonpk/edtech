import React, {useEffect, useRef, useState} from "react";
import {SlideImage} from "@/config/data";
import {useImage} from "@/context/image-context";
import {usePresentation} from "@/context/presentation-context";
import {ResizableImage} from "./resizable-image";
import Draggable from "react-draggable";
import ImageActions from "./image-actions";

const Image = () => {
  const {
    imageState,
    size,
    position,
    setPosition,
    imageRef,
    rotation,
    activeDrag,
    setActiveDrag,
    setIsSelected,
    isSelected,
    image,
    deleteImage,
    isRotating,
    activeTransform,
    setActiveTransform,
  } = useImage()!;

  const {
    setActiveEdit,
    activeEdit,
    activeDragGlobal,
    setActiveDragGlobal,
    updateImageData,
    copyTextBox,
    cutTextBox,
    mode,
    groupSelectedImages,
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
    if (activeEdit !== imageState.imageId) {
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

    const boxHeight = imageRef.current?.clientHeight || 0;

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
      if (selection?.focusNode?.nodeName !== "#text") {
        if (e.key === "Backspace" && isSelected) {
          deleteImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, deleteImage, copyTextBox, cutTextBox]);

  const [isCenteredX, setIsCenteredX] = React.useState<boolean>(false);
  const [isCenteredY, setIsCenteredY] = React.useState<boolean>(false);

  const textBoxPlaceholderRef = useRef<HTMLDivElement>(null);

  const isGroupSelected = groupSelectedImages
    ? groupSelectedImages?.includes(image.imageId)
    : false;

  useEffect(() => {
    if (!activeTransform) {
      updateImageData(
        {
          position: {x: position.x, y: position.y},
          size: {width: size.width},
          rotation: rotation,
        },
        image.imageId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTransform]);

  return (
    <>
      <div className={`relative ${isSelected ? "z-10" : "z-0"}`}>
        <Draggable
          cancel=".nodrag"
          disabled={mode === "aiRewrite"}
          onDrag={handleDrag}
          position={position}
          onStop={() => {
            setActiveEdit(imageState.imageId);
            setActiveTransform(false);
          }}
        >
          <div
            id={`ui-image-${imageState.imageId}`}
            className=" absolute z-30 origin-center pointer-events-none group "
            style={{
              width: size.width,
              height: "fit-content",
              cursor:
                mode === "aiRewrite"
                  ? "default"
                  : activeDrag
                  ? "move"
                  : "pointer",
            }}
          >
            <div
              onClick={() => {
                if (mode !== "aiRewrite") {
                  setActiveEdit(imageState.imageId);
                  setIsSelected(true);
                }
              }}
              className="pointer-events-auto p-2 "
            >
              <img
                src={image.image.path}
                alt="slide"
                className="pointer-events-none "
                style={{
                  // position: "absolute",
                  top: image.position.y,
                  left: image.position.x,
                  width: image.size.width,
                  transform: `rotate(${image.rotation}deg)`,
                  visibility: isSelected ? "hidden" : "visible",
                }}
              />
            </div>
            <ImageActions />
            {!isGroupSelected && (
              <div
                id="drag-area"
                className="w-full h-full absolute top-0  z-20"
              ></div>
            )}
            {!isSelected && !activeDragGlobal && mode !== "aiRewrite" && (
              <div
                className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px] hidden group-hover:block`}
              />
            )}
            {isRotating && (
              <div className="bg-black rounded-md border shadow-sm absolute p-2 text-white  left-1/2 -translate-x-1/2 -bottom-20 translate-y-full w-[50px] flex items-center justify-center">
                {rotation}°
              </div>
            )}
          </div>
        </Draggable>

        {(isSelected || isGroupSelected) && (
          <ResizableImage disabled={isGroupSelected}>
            <img
              onClick={() => {
                setActiveEdit(imageState.imageId);
                setIsSelected(true);
              }}
              ref={imageRef}
              src={image.image.path}
              alt={image.image.title}
              className="selectDisable "
            />
          </ResizableImage>
        )}
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

export default Image;
