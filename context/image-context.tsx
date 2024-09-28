"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {TextBoxType, Size, Position, SlideImage} from "@/config/data";
import {usePresentation} from "@/context/presentation-context";
import {set} from "zod";

interface ImageContextType {
  // states -----------------------------
  imageState: SlideImage;
  size: Size;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  imageRef: React.RefObject<HTMLImageElement>;
  rotation: number;
  activeDrag: boolean;
  setActiveDrag: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
  image: SlideImage;
  deleteImage: () => void;
  isRotating: boolean;
  activeTransform: boolean;
  setActiveTransform: React.Dispatch<React.SetStateAction<boolean>>;
  setSize: React.Dispatch<React.SetStateAction<Size>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  setIsRotating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageContext = createContext<ImageContextType | null>(null);

export function useImage() {
  return useContext(ImageContext);
}

interface Props {
  children?: React.ReactNode;
  image: SlideImage;
}

export const ImageProvider = ({children, image}: Props) => {
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

  const [imageState, setImageState] = useState<SlideImage>(image);

  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [activeTransform, setActiveTransform] = useState<boolean>(false);

  useEffect(() => {
    if (!slideData || !selectedSlide) return;
    const slide = slideData.slides.find(
      (slide) => slide.id === selectedSlide.id
    );

    const newImageState =
      slide?.images.find((textB) => textB.imageId === image.imageId) || image;

    setImageState(newImageState);
  }, [slideData, selectedSlide]);

  const deleteImage = () => {
    // delete image from slide
    if (!selectedSlide || !slideData) return;

    const newSlideData = slideData.slides.map((slide) => {
      if (slide.id === selectedSlide?.id) {
        const newImages = slide.images.filter(
          (img) => img.imageId !== imageState.imageId
        );
        return {...slide, images: newImages};
      }
      return slide;
    });

    setSlideData({...slideData, slides: newSlideData});
    setHistory([{...slideData, slides: newSlideData}, ...history]);
  };

  useEffect(() => {
    if (position !== imageState.position) {
      setPosition(imageState.position);
    }
    if (size !== imageState.size) {
      setSize(imageState.size);
    }
    if (rotation !== imageState.rotation) {
      setRotation(imageState.rotation);
    }
  }, [imageState]);

  const [position, setPosition] = React.useState<Position>({
    x: image.position.x,
    y: image.position.y,
  });

  const [size, setSize] = React.useState<Size>({
    width: image.size.width,
  });

  const [rotation, setRotation] = React.useState(image.rotation || 0);

  const imageRef = React.useRef<HTMLImageElement>(null);

  const [activeDrag, setActiveDrag] = React.useState<boolean>(false);

  // track if this image is selected
  useEffect(() => {
    if (activeEdit === imageState.imageId) {
      setIsSelected(true);
    } else if (
      isSelected &&
      selectedTextBox?.textBoxId !== imageState.imageId
    ) {
      // updateData({text: textBoxText.current}, textBoxState.textBoxId);
      setIsSelected(false);
    }
  }, [activeEdit]);

  console.log("activeEdit", activeEdit);

  const values = {
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
    setSize,
    setRotation,
    setIsRotating,
  };

  return (
    <ImageContext.Provider value={values}>{children}</ImageContext.Provider>
  );
};

export default ImageContext;
