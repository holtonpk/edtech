import React, {Children, useEffect, useRef, useState} from "react";

import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {SlideData, TextBoxType} from "@/config/data";
import TabContent from "./tab-content";
import {array} from "zod";
import {useHover} from "../index";
import {ShapeComponentsArray} from "@/config/shapes";
const Shapes = () => {
  const {isHovering, hoveredIndex} = useHover()!;

  const [fillColor, setFillColor] = useState<string>("#000000");

  const [strokeColor, setStrokeColor] = useState<string>("#000000");

  const [strokeWidth, setStrokeWidth] = useState<number>(4);

  const [size, setSize] = useState<{
    height: number;
    width: number;
  }>({
    height: 100,
    width: 100,
  }); // Default size

  const {
    slideData,
    setSlideData,
    selectedSlide,
    slideDataRef,
    setActiveEdit,
    addIdToLayerMap,
  } = usePresentation()!;

  const createNewShape = (shapeName: string) => {
    if (slideDataRef.current && selectedSlide) {
      const shapeId = Math.random().toString();
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              shapes: [
                ...(slide.shapes || []),
                {
                  fillColor,
                  strokeColor,
                  strokeWidth,
                  size,
                  position: {x: 0, y: 0},
                  rotation: 0,
                  shapeId,
                  shapeName,
                },
              ],
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      setTimeout(() => {
        setActiveEdit(shapeId);
        addIdToLayerMap(shapeId);
      }, 5);
    }
  };

  return (
    <TabContent title="Shapes" description="Add Shapes to presentation">
      <div
        className={`w-full  overflow-scroll 
        ${isHovering ? "h-[425px]" : "h-[425px] md:h-full pb-10"}
        `}
      >
        <div className="grid grid-cols-3 overflow-scroll gap-4 h-fit w-full  mt-6">
          {ShapeComponentsArray.map(({name, component}, index) => (
            <div
              key={index}
              className={`h-20 w-20 p-1 rounded-md  cursor-pointer  hover:bg-background/70  ${
                hoveredIndex === index ? "bg-background/70" : ""
              }`}
              onClick={() => createNewShape(name)}
            >
              {component({
                fillColor,
                strokeColor,
                strokeWidth,
              })}
            </div>
          ))}
        </div>
      </div>
    </TabContent>
  );
};

export default Shapes;
