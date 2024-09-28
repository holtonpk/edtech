"use client";
import {init} from "next/dist/compiled/webpack/webpack";
import React, {useEffect, useCallback, useRef, useState} from "react";

const SlideSelector = () => {
  const [slideData, setSlideData] = useState(DummyData);

  const slideContainer = React.useRef<HTMLDivElement>(null);
  const slideColumn = React.useRef<HTMLDivElement>(null);

  const [activeDrag, setActiveDrag] = React.useState(false);

  const [dragIndex, setDragIndex] = React.useState<number>(0);

  return (
    <div className="h-full relative overflow-hidden grid w-[200px] mx-auto mt-10 gap-4">
      <div
        ref={slideContainer}
        className="h-full w-full max-h-full relative overflow-scroll"
      >
        <div
          ref={slideColumn}
          className="flex flex-col w-full h-fit justify-start items-start gap-4 z-20  relative pt-2"
        >
          {slideData.slides
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((slide, index) => (
              <SlidePreview
                key={slide.id}
                slide={slide}
                slideContainer={slideContainer}
                activeDrag={activeDrag}
                setActiveDrag={setActiveDrag}
                slideColumn={slideColumn}
                dragIndex={dragIndex}
                setDragIndex={setDragIndex}
                index={index}
                slideData={slideData}
                setSlideData={setSlideData}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SlideSelector;

const SlidePreview = ({
  slide,
  slideContainer,
  activeDrag,
  setActiveDrag,
  slideColumn,
  dragIndex,
  setDragIndex,
  index,
  slideData,
  setSlideData,
}: {
  slide: any;
  slideContainer: React.RefObject<HTMLDivElement>;
  activeDrag: boolean;
  setActiveDrag: React.Dispatch<React.SetStateAction<boolean>>;
  slideColumn: React.RefObject<HTMLDivElement>;
  dragIndex: number;
  setDragIndex: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  slideData: any;
  setSlideData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [isBeingDragged, setIsBeingDragged] = React.useState(false);

  const [yOffset, setYOffset] = React.useState(0);
  const isMouseDownRef = useRef(false); // Track if mouse is down

  const initialPositionRef = React.useRef({top: 0, height: 0});

  //   const initialIndex = React.useRef(index);

  const slideIndexRef = React.useRef(0);

  const calculateNewOrder = () => {
    if (
      !slideColumn.current ||
      !slideContainer.current ||
      !selectorContainerRef.current
    )
      return;

    const slides = Array.from(slideColumn.current.children) as HTMLDivElement[];
    const containerTop = slideContainer.current.getBoundingClientRect().top;
    const draggedSlideTop =
      selectorContainerRef.current.getBoundingClientRect().top;
    const draggedSlideHeight =
      selectorContainerRef.current.getBoundingClientRect().height;

    let slideIndex = 0;

    slides.forEach((slideElem) => {
      if (slideElem.id === slide.id) {
        // Skip the dragged slide itself
        return;
      }

      const slideTop = slideElem.getBoundingClientRect().top;
      const slideHeight = slideElem.getBoundingClientRect().height;
      const slideMiddle = slideTop + slideHeight / 2;

      // If the dragged slide's top is below this slide's middle, increase the index
      if (draggedSlideTop + draggedSlideHeight / 2 > slideMiddle) {
        slideIndex++;
      }
    });

    console.log("d:", slideIndex);
    setDragIndex(slideIndex);
    if (slide.orderIndex > slideIndex) {
      slideIndexRef.current = slideIndex + 1;
      console.log("s", slideIndexRef.current);
    } else {
      slideIndexRef.current = slideIndex;
    }
  };

  const calculateTop = (e: MouseEvent) => {
    if (
      !isMouseDownRef.current ||
      !selectorContainerRef.current ||
      !slideContainer.current
    )
      return;
    setIsBeingDragged(true);
    setActiveDrag(true);
    const {clientY} = e;
    const containerTop = slideContainer.current.getBoundingClientRect().top;
    const offset = clientY - containerTop - initialPositionRef.current.top;
    calculateNewOrder();
    setYOffset(offset);
  };

  const onMouseUp = useCallback(() => {
    setIsBeingDragged(false);
    setActiveDrag(false);
    reorderSlides();
  }, [setIsBeingDragged, setActiveDrag]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isMouseDownRef.current = true;
      // Capture the initial position of the element
      if (!selectorContainerRef.current) return;
      const {top, height} =
        selectorContainerRef.current.getBoundingClientRect();
      initialPositionRef.current = {top, height};

      window.addEventListener("mousemove", calculateTop);
      window.addEventListener(
        "mouseup",
        () => {
          isMouseDownRef.current = false;
          window.removeEventListener("mousemove", calculateTop);
          onMouseUp();
        },
        {once: true}
      );
    },
    [calculateTop, onMouseUp, setIsBeingDragged]
  );

  const reorderSlides = () => {
    if (!slideData) return;

    // Get the list of slides
    const slides = [...slideData.slides];

    // Find the dragged slide's initial and target orderIndex
    const draggedSlide = slides.find((s) => s.id === slide.id);
    if (!draggedSlide) return;

    const initialOrderIndex = draggedSlide.orderIndex;
    const targetOrderIndex = slideIndexRef.current;

    // Check if there's no actual move
    if (initialOrderIndex === targetOrderIndex) return;

    // Move other slides to accommodate the new order
    slides.forEach((s) => {
      if (s.id !== draggedSlide.id) {
        // If a slide's orderIndex is between the dragged slide's initial and target positions, shift it accordingly
        if (
          initialOrderIndex < targetOrderIndex &&
          s.orderIndex > initialOrderIndex &&
          s.orderIndex <= targetOrderIndex
        ) {
          s.orderIndex -= 1;
        } else if (
          initialOrderIndex > targetOrderIndex &&
          s.orderIndex >= targetOrderIndex &&
          s.orderIndex < initialOrderIndex
        ) {
          s.orderIndex += 1;
        }
      }
    });

    // Assign the new orderIndex to the dragged slide
    draggedSlide.orderIndex = targetOrderIndex;

    // Update slideData
    setSlideData({...slideData, slides});
  };

  return (
    <div id={slide.id} className="h-full w-full relative">
      <div
        onMouseDown={onMouseDown}
        ref={selectorContainerRef}
        style={{
          background: slide.bg,
          top: isBeingDragged ? yOffset : "0px",
        }}
        className={`rounded-lg w-full relative aspect-[16/9]  p-6 flex items-center justify-center bg-white text-black  transition-colors duration-300 cursor-pointer border-4
        ${isBeingDragged ? "z-40 " : "z-20 "}
`}
      >
        {slide.id}
      </div>
      {activeDrag && dragIndex === index && (
        <div className="w-full h-1 bg-primary absolute -bottom-[8px] translate-y-1/2 z-40"></div>
      )}
      {activeDrag && dragIndex === index && index == 0 && (
        <div className="w-full h-1 bg-primary absolute -top-[8px] -translate-y-1/2 z-50"></div>
      )}
      {/* {index == 0 && (
        <div className="w-full h-1 bg-red-200 absolute -top-[8px] -translate-y-1/2 z-40">
          {index}
        </div>
      )}
      <div className="w-full h-1 bg-red-200 absolute -bottom-[8px] translate-y-1/2 z-30">
        {index}
      </div> */}
    </div>
  );
};

const DummyData = {
  slides: [
    {
      id: "1",
      bg: "red",
      orderIndex: 0,
    },
    {
      id: "4",
      bg: "blue",
      orderIndex: 1,
    },
    {
      id: "3",
      bg: "green",
      orderIndex: 2,
    },
    {
      id: "5",
      bg: "yellow",
      orderIndex: 3,
    },
    {
      id: "2",
      bg: "pink",
      orderIndex: 4,
    },
  ],
};

const NewData = {
  slides: [
    {
      id: "1",
      bg: "red",
      orderIndex: 0,
    },
    {
      id: "2",
      bg: "blue",
      orderIndex: 2,
    },
    {
      id: "3",
      bg: "green",
      orderIndex: 3,
    },
    {
      id: "4",
      bg: "yellow",
      orderIndex: 1,
    },
    {
      id: "5",
      bg: "pink",
      orderIndex: 4,
    },
  ],
};
