"use client";
import React, {useEffect} from "react";
import {useShape} from "@/context/shape-context";
import {usePresentation} from "@/context/presentation-context";
import {ShapeComponentsArray} from "@/config/shapes";
import Draggable from "react-draggable";
import ShapeActions from "./shape-actions";
import RotationDisplay from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/textbox-actions/rotation-display";
import {ResizableShape} from "./resizable-shape";

const Shape = () => {
  const {
    shapeState,
    size,
    position,
    setPosition,
    shapeRef,
    rotation,
    activeDrag,
    setActiveDrag,
    setIsSelected,
    isSelected,
    shape,
    deleteShape,
    isRotating,
    activeTransform,
    setActiveTransform,
    setSize,
    setRotation,
    setIsRotating,
  } = useShape()!;

  const {
    mode,
    setActiveEdit,
    activeEdit,
    setActiveSlide,
    groupSelectedShapes,
    activeDragGlobal,
    updateShapeData,
    setActiveDragGlobal,
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

  const [isCenteredX, setIsCenteredX] = React.useState<boolean>(false);
  const [isCenteredY, setIsCenteredY] = React.useState<boolean>(false);

  const handleDrag = (e: any, ui: any) => {
    setActiveDrag(true);
    setActiveTransform(true);
    if (activeEdit !== shapeState.shapeId) {
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

    const boxHeight = shapeRef.current?.clientHeight || 0;

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

  const isGroupSelected = groupSelectedShapes
    ? groupSelectedShapes?.includes(shape.shapeId)
    : false;

  useEffect(() => {
    if (!activeTransform) {
      updateShapeData(
        {
          position: {x: position.x, y: position.y},
          size: {width: size.width, height: size.height},
          rotation: rotation,
        },
        shape.shapeId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTransform]);

  const ShapeElement = ShapeComponentsArray.find(
    (shapeComponent) => shapeComponent.name === shapeState.shapeName
  );

  return (
    <>
      <div className={`relative ${isSelected ? "z-10" : "z-0"}`}>
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
            id={`ui-shape-${shapeState.shapeId}`}
            className=" absolute z-30 origin-center pointer-events-none group "
            style={{
              width: size.width,
              height: size.height,

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
                  setActiveEdit(shapeState.shapeId);
                  setIsSelected(true);
                  setActiveSlide(undefined);
                }
              }}
              style={{
                transform: `rotate(${rotation}deg)`,
                visibility: isSelected ? "hidden" : "visible",
              }}
              className="pointer-events-auto p-2 w-full h-full"
            >
              {ShapeElement && (
                <ShapeElement.component
                  fillColor={shapeState.fillColor}
                  strokeColor={shapeState.strokeColor}
                  strokeWidth={shapeState.strokeWidth}
                />
              )}
            </div>
            <ShapeActions />
            {!isGroupSelected && (
              <div
                id="drag-area"
                className="w-full h-full absolute top-0  z-20"
              ></div>
            )}
            {!isSelected && !activeDragGlobal && mode !== "aiRewrite" && (
              <div
                style={{
                  transform: `rotate(${rotation}deg `,
                }}
                className={`absolute border-2 border-primary top-0 left-0 h-full w-full z-20 pointer-events-none rounded-[3px] hidden group-hover:block`}
              />
            )}
            {isRotating && <RotationDisplay rotation={rotation} />}
          </div>
        </Draggable>

        {(isSelected || isGroupSelected) && (
          <ResizableShape disabled={isGroupSelected}>
            {ShapeElement && (
              <ShapeElement.component
                fillColor={shapeState.fillColor}
                strokeColor={shapeState.strokeColor}
                strokeWidth={shapeState.strokeWidth}
              />
            )}
          </ResizableShape>
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

export default Shape;
