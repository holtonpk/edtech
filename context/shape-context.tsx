"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {TextBoxType, Position, SlideShape} from "@/config/data";
import {usePresentation} from "@/context/presentation-context";
import {set} from "zod";

type Size = {
  width: number;
  height: number;
};

interface ShapeContextType {
  // states -----------------------------
  shapeState: SlideShape;
  size: Size;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  shapeRef: React.RefObject<HTMLDivElement>;
  rotation: number;
  activeDrag: boolean;
  setActiveDrag: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
  shape: SlideShape;
  deleteShape: () => void;
  isRotating: boolean;
  activeTransform: boolean;
  setActiveTransform: React.Dispatch<React.SetStateAction<boolean>>;
  setSize: React.Dispatch<React.SetStateAction<Size>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  setIsRotating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShapeContext = createContext<ShapeContextType | null>(null);

export function useShape() {
  return useContext(ShapeContext);
}

interface Props {
  children?: React.ReactNode;
  shape: SlideShape;
}

export const ShapeProvider = ({children, shape}: Props) => {
  // states -----------------------------

  const {
    updateData,
    selectedTextBox,
    slideData,
    activeEdit,
    setActiveEdit,
    mode,
    setMode,
    selectedSlide,
    setSlideData,
    history,
    setHistory,
  } = usePresentation()!;

  const [shapeState, setImageState] = useState<SlideShape>(shape);

  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [activeTransform, setActiveTransform] = useState<boolean>(false);

  useEffect(() => {
    if (!slideData || !selectedSlide) return;
    const slide = slideData.slides.find(
      (slide) => slide.id === selectedSlide.id
    );

    const newShapeState =
      slide?.shapes.find((textB) => textB.shapeId === shape.shapeId) || shape;

    setImageState(newShapeState);
  }, [slideData, selectedSlide]);

  const deleteShape = () => {
    // delete shape from slide
    if (!selectedSlide || !slideData) return;

    const newSlideData = slideData.slides.map((slide) => {
      if (slide.id === selectedSlide?.id) {
        const newShapes = slide.shapes.filter(
          (img) => img.shapeId !== shapeState.shapeId
        );
        return {...slide, shapes: newShapes};
      }
      return slide;
    });

    setSlideData({...slideData, slides: newSlideData});
    setHistory([{...slideData, slides: newSlideData}, ...history]);
  };

  useEffect(() => {
    if (position !== shapeState.position) {
      setPosition(shapeState.position);
    }
    if (size !== shapeState.size) {
      setSize(shapeState.size);
    }
    if (rotation !== shapeState.rotation) {
      setRotation(shapeState.rotation);
    }
  }, [shapeState]);

  const [position, setPosition] = React.useState<Position>({
    x: shape.position.x,
    y: shape.position.y,
  });

  const [size, setSize] = React.useState<Size>({
    width: shape.size.width,
    height: shape.size.height,
  });

  const [rotation, setRotation] = React.useState(shape.rotation || 0);

  const shapeRef = React.useRef<HTMLDivElement>(null);

  const [activeDrag, setActiveDrag] = React.useState<boolean>(false);

  // track if this shape is selected
  useEffect(() => {
    if (activeEdit === shapeState.shapeId) {
      setIsSelected(true);
    } else if (
      isSelected &&
      selectedTextBox?.textBoxId !== shapeState.shapeId
    ) {
      // updateData({text: textBoxText.current}, textBoxState.textBoxId);
      setIsSelected(false);
    }
  }, [activeEdit]);

  const values = {
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
  };

  return (
    <ShapeContext.Provider value={values}>{children}</ShapeContext.Provider>
  );
};

export default ShapeContext;
