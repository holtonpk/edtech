import React, {useRef, useEffect, useState} from "react";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import {Position} from "@/config/data";
import {set} from "zod";
import Draggable from "react-draggable";
import TextboxActions from "./multi-textbox-actions";

const GroupSelection = () => {
  const {
    activeGroupSelectedTextBoxes,
    mode,
    slideData,
    selectedSlide,
    setSlideData,
    copyTextBox,
    cutTextBox,
    groupSelectedTextBoxes,
    deleteMultiTextBoxes,
    activeGroupSelectedImages,
  } = usePresentation()!;

  useEffect(() => {
    console.log("activeGroupSelectedTextBoxes");
    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;

    const slideContainer = document.getElementById("slide-container");
    if (!slideContainer) return;

    const slideContainerRect = slideContainer.getBoundingClientRect();

    activeGroupSelectedTextBoxes &&
      activeGroupSelectedTextBoxes.length > 0 &&
      activeGroupSelectedTextBoxes.forEach((textBoxId) => {
        const textBoxElement = document.getElementById(
          `ui-text-box-${textBoxId}`
        );
        if (!textBoxElement) return;

        const textBoxRect = textBoxElement.getBoundingClientRect();

        const textBoxX = textBoxRect.left - slideContainerRect.left;
        const textBoxY = textBoxRect.top - slideContainerRect.top;
        const textBoxRight = textBoxRect.right - slideContainerRect.left;
        const textBoxBottom = textBoxRect.bottom - slideContainerRect.top;

        // Update boundaries for the box
        xMin = Math.min(xMin, textBoxX);
        yMin = Math.min(yMin, textBoxY);
        xMax = Math.max(xMax, textBoxRight);
        yMax = Math.max(yMax, textBoxBottom);
      });

    activeGroupSelectedImages &&
      activeGroupSelectedImages.length > 0 &&
      activeGroupSelectedImages.forEach((imageId) => {
        const imageElement = document.getElementById(`ui-image-${imageId}`);
        if (!imageElement) return;

        const imageRect = imageElement.getBoundingClientRect();

        const imageX = imageRect.left - slideContainerRect.left;
        const imageY = imageRect.top - slideContainerRect.top;
        const imageRight = imageRect.right - slideContainerRect.left;
        const imageBottom = imageRect.bottom - slideContainerRect.top;

        // Update boundaries for the box
        xMin = Math.min(xMin, imageX);
        yMin = Math.min(yMin, imageY);
        xMax = Math.max(xMax, imageRight);
        yMax = Math.max(yMax, imageBottom);
      });

    // Calculate width and height based on the farthest text boxes
    const calculatedWidth = xMax - xMin;
    const calculatedHeight = yMax - yMin;

    console.log("calculatedWidth", calculatedWidth);
    console.log("calculatedHeight", calculatedHeight);
    console.log("x", xMin);
    console.log("y", yMin);

    setSize({
      width: calculatedWidth,
      height: calculatedHeight,
    });
    setPosition({
      x: xMin,
      y: yMin,
    });
  }, [activeGroupSelectedTextBoxes, activeGroupSelectedImages]);

  const resizeHandles = ["e", "w"];
  const scaleHandles = ["se"];

  const handleRef = React.useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({x: 0, y: 0});
  const [size, setSize] = useState({width: 0, height: 0});
  const [rotation, setRotation] = useState<number>(0);
  const [activeDrag, setActiveDrag] = useState<boolean>(false);
  const [activeTransform, setActiveTransform] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  // used to style active resize handles
  const [activeResizeHandle, setActiveResizeHandle] = useState<
    string | undefined
  >(undefined);

  // used to style active scale handles
  const [activeScaleHandle, setActiveScaleHandle] = useState<
    string | undefined
  >(undefined);

  const UpdateTextBoxes = (
    deltaX: number,
    scale?: number,
    positionChangeX?: number
  ) => {
    if (!selectedSlide || !activeGroupSelectedTextBoxes || !slideData) return;

    const updatedSlideData = {
      ...slideData,
      slides: slideData.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            textBoxes: slide.textBoxes.map((textBox, idx) => {
              if (!activeGroupSelectedTextBoxes.includes(textBox.textBoxId))
                return textBox;
              else {
                return {
                  ...textBox,
                  // Adjust size by deltaX
                  size: {width: (textBox.size.width += deltaX)},
                  // Scale the font size if needed
                  fontSize: scale
                    ? (textBox.fontSize *= scale)
                    : textBox.fontSize,
                  // Adjust position only when resizing from the west
                  position: positionChangeX
                    ? {
                        x: (textBox.position.x += positionChangeX),
                        y: textBox.position.y,
                      }
                    : textBox.position,
                };
              }
            }),
          };
        }
        return slide;
      }),
    };

    setSlideData(updatedSlideData);
  };

  const UpdatePositions = (deltaX: number, deltaY: number) => {
    if (!selectedSlide || !slideData) return;

    const updatedSlideData = {
      ...slideData,
      slides: slideData.slides.map((slide) => {
        if (slide.id === selectedSlide.id) {
          return {
            ...slide,
            textBoxes: slide.textBoxes.map((textBox, idx) => {
              if (
                activeGroupSelectedTextBoxes &&
                !activeGroupSelectedTextBoxes.includes(textBox.textBoxId)
              )
                return textBox;
              else {
                return {
                  ...textBox,
                  position: {
                    x: textBox.position.x + deltaX,
                    y: textBox.position.y + deltaY,
                  },
                };
              }
            }),
            images: slide.images.map((image, idx) => {
              if (
                activeGroupSelectedImages &&
                !activeGroupSelectedImages.includes(image.imageId)
              )
                return image;
              else {
                return {
                  ...image,
                  position: {
                    x: image.position.x + deltaX,
                    y: image.position.y + deltaY,
                  },
                };
              }
            }),
          };
        }
        return slide;
      }),
    };

    setSlideData(updatedSlideData);
  };

  const handleResize = React.useCallback(
    (handleAxis: string, deltaX: number) => {
      switch (handleAxis) {
        case "e":
          console.log("delta x", deltaX);
          setSize((prevSize) => ({
            width: prevSize.width + deltaX,
            height: prevSize.height,
          }));
          UpdateTextBoxes(deltaX);
          break;
        case "w":
          setPosition((prevPosition) => ({
            y: prevPosition.y,
            x: prevPosition.x + deltaX,
          }));
          setSize((prevSize) => ({
            width: prevSize.width - deltaX,
            height: prevSize.height,
          }));
          UpdateTextBoxes(-deltaX, 1, deltaX);
          break;

        default:
          break;
      }
    },
    [setSize, setPosition, UpdateTextBoxes, slideData]
  );

  const isScaling = React.useRef<boolean>(false);

  const controlScale = React.useCallback(
    (handleAxis: string, deltaX: number, deltaY: number) => {
      switch (handleAxis) {
        case "se":
          const scale = (size.width + deltaX) / size.width;
          setSize((prevSize) => ({
            width: prevSize.width + deltaX,
            height: prevSize.height * scale,
          }));
          UpdateTextBoxes(Math.round(deltaX), scale);
          break;

        default:
          break;
      }
      isScaling.current = false;
    },
    [setSize, setPosition, UpdateTextBoxes]
  );

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
    // if (activeEdit !== textBox.textBoxId) {
    //   setActiveEdit(undefined);
    // }

    const {x, y} = position;

    let deltaX = ui.deltaX;
    let deltaY = ui.deltaY;
    const isCenteredX = checkIfCenteredHorizontallyContainer(x + deltaX);
    const isCenteredY = checkIfCenteredVerticallyContainer(y + deltaY);

    let newX = x + deltaX;
    let newY = y + deltaY;

    if (isCenteredX.centered) {
      newX = isCenteredX.centerPoint;
      deltaX = newX - position.x;
    }

    if (isCenteredY.centered) {
      newY = isCenteredY.centerPoint;
      deltaY = newY - position.y;
    }

    if (deltaX === 0 && deltaY === 0) return;

    UpdatePositions(deltaX, deltaY);
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

    const boxHeight = size.height || 0;

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

  const [isCenteredX, setIsCenteredX] = React.useState<boolean>(false);
  const [isCenteredY, setIsCenteredY] = React.useState<boolean>(false);

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
        if (groupSelectedTextBoxes) {
          if (e.key === "Backspace") {
            deleteMultiTextBoxes();
          }
          if (e.metaKey && e.key === "c") {
            copyTextBox();
          }
          if (e.metaKey && e.key === "x") {
            cutTextBox();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copyTextBox, cutTextBox, groupSelectedTextBoxes]);

  return (
    <>
      <div className="z-20">
        <Draggable
          cancel=".nodrag"
          disabled={mode === "aiRewrite"}
          onDrag={handleDrag}
          position={position}
          onStop={() => {
            // setActiveEdit(textBox.textBoxId);
            setActiveTransform(false);
            // setActiveGroupSelectedTextBoxes(undefined);
          }}
        >
          <div
            className="origin-center  absolute z-10"
            style={{
              width: size.width,
              height: size.height,
            }}
          >
            <TextboxActions
              position={position}
              size={size}
              activeDrag={activeDrag}
              activeTransform={activeTransform}
            />
            {/* {scaleHandles.map((handleAxis) => (
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
        ))} */}

            {isRotating && (
              <div className="bg-black rounded-md border shadow-sm absolute p-2 text-white  left-1/2 -translate-x-1/2 -bottom-20 translate-y-full w-[50px] flex items-center justify-center">
                {rotation}°
              </div>
            )}
          </div>
        </Draggable>

        <div
          className="absolute nodrag z-40"
          style={{
            width: size.width,
            height: size.height,
            left: position.x,
            top: position.y,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            className={`absolute border-2 border-primary border-dashed top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px]`}
          />

          {!activeGroupSelectedImages &&
            resizeHandles.map((handleAxis) => (
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
        </div>
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

export default GroupSelection;
