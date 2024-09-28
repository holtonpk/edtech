import React, {useRef, useEffect, useState} from "react";
import {usePresentation} from "@/context/presentation-context";
import ResizableHandle from "./resizable-handle";
import ScaleHandle from "./scale-handle";
import {set} from "zod";
const GroupSelection = () => {
  const {
    activeGroupSelectedTextBoxes,
    slideData,
    selectedSlide,
    setSlideData,
    updateData,
  } = usePresentation()!;

  useEffect(() => {
    if (
      !activeGroupSelectedTextBoxes ||
      activeGroupSelectedTextBoxes.length === 0
    )
      return;

    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;

    const slideContainer = document.getElementById("slide-container");
    if (!slideContainer) return;

    const slideContainerRect = slideContainer.getBoundingClientRect();

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

    // Calculate width and height based on the farthest text boxes
    const calculatedWidth = xMax - xMin;
    const calculatedHeight = yMax - yMin;

    setSize({
      width: calculatedWidth,
      height: calculatedHeight,
    });
    setPosition({
      x: xMin,
      y: yMin,
    });
  }, [activeGroupSelectedTextBoxes]);

  const resizeHandles = ["e", "w"];
  const scaleHandles = ["se"];

  const handleRef = React.useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({x: 0, y: 0});
  const [size, setSize] = useState({width: 0, height: 0});

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

  const UpdateTextBoxes = (deltaX: number, scale?: number) => {
    if (!selectedSlide || !activeGroupSelectedTextBoxes || !slideData) return;

    console.log("delta x", deltaX);

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
                  size: {width: (textBox.size.width += deltaX)},
                  fontSize: textBox.fontSize * scale! || textBox.fontSize,
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
          UpdateTextBoxes(deltaX);
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

          setSize((prevSize) => ({
            width: prevSize.width + deltaX,
            height: prevSize.height,
          }));
          UpdateTextBoxes(Math.round(deltaX));
          break;

        default:
          break;
      }
      isScaling.current = false;
    },
    [setSize, setPosition]
  );
  return (
    <>
      <div
        className="nodrag origin-center  absolute z-10"
        style={{
          top: position.y,
          left: position.x,
          width: size.width,
          height: size.height,
        }}
      >
        <div
          className={`absolute border-2 border-primary border-dashed top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px]`}
        />

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
      </div>
    </>
  );
};

export default GroupSelection;
