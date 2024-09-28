"use client";
import React, {useEffect, useRef, useState} from "react";
import {CursorModes, size, TextBoxType} from "@/config/data";
import {Slide, SlideData} from "@/config/data";
import TextBox from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox";
import {TextBoxProvider} from "@/context/textbox-context";
import {usePresentation} from "@/context/presentation-context";
const TextBoxCreate = ({
  setSlideData,
  slideData,
  selectedSlide,
}: {
  setSlideData: React.Dispatch<React.SetStateAction<SlideData | undefined>>;
  selectedSlide: Slide | undefined;

  slideData: SlideData;
}) => {
  const textBoxArea = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState<{x: number; y: number} | null>(null);
  const [endPos, setEndPos] = useState<{x: number; y: number} | null>(null);

  const {setMode} = usePresentation()!;

  const [localTextBox, setLocalTextBox] = useState<TextBoxType | undefined>(
    undefined
  );

  useEffect(() => {
    if (!textBoxArea.current || localTextBox) return;
    const textBox = textBoxArea.current;
    let clickTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      clickTimeout = setTimeout(() => {
        const rect = textBox.getBoundingClientRect();
        setDragging(true);
        setStartPos({x: e.clientX - rect.left, y: e.clientY - rect.top});
        setEndPos(null);
      }, 200); // Delay to distinguish between single and double-click
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const rect = textBox.getBoundingClientRect();
        setEndPos({x: e.clientX - rect.left, y: e.clientY - rect.top});
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
      const rect = textBox.getBoundingClientRect();
      setDragging(false);
      setEndPos({x: e.clientX - rect.left, y: e.clientY - rect.top});
      if (startPos) {
        createNewTextBox({
          x: Math.min(startPos.x, e.clientX - rect.left),
          y: Math.min(startPos.y, e.clientY - rect.top),
          width: Math.abs(startPos.x - (e.clientX - rect.left)),
          height: Math.abs(startPos.y - (e.clientY - rect.top)),
        });
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
      const rect = textBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createNewTextBox({
        x,
        y,
        width: 500,
        height: 50,
      });
    };

    textBox.addEventListener("mousedown", handleMouseDown);
    textBox.addEventListener("mousemove", handleMouseMove);
    textBox.addEventListener("mouseup", handleMouseUp);
    textBox.addEventListener("dblclick", handleDoubleClick);

    return () => {
      textBox.removeEventListener("mousedown", handleMouseDown);
      textBox.removeEventListener("mousemove", handleMouseMove);
      textBox.removeEventListener("mouseup", handleMouseUp);
      textBox.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [dragging, startPos, localTextBox]);

  const calculateBoxStyle = (): React.CSSProperties => {
    if (!startPos || !endPos) return {};
    const left = Math.min(startPos.x, endPos.x);
    const top = Math.min(startPos.y, endPos.y);
    const width = Math.abs(startPos.x - endPos.x);
    const height = Math.abs(startPos.y - endPos.y);
    return {
      left,
      top,
      width,
      height,
      position: "absolute",
    };
  };

  const createNewTextBox = (box: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const TextBoxID = Math.floor(Math.random() * 10000000000).toString();
    const newlocal = {
      text: "",
      position: {
        x: box.x,
        y: box.y,
      },
      size: {
        width: box.width,
        height: box.height,
      },
      textBoxId: TextBoxID,
      rotation: 0,
      fontSize: 16,
    };
    setLocalTextBox(newlocal);
  };

  return (
    <>
      {localTextBox ? (
        <TextBoxProvider textBox={localTextBox}>
          <TextBox />
        </TextBoxProvider>
      ) : (
        <div
          ref={textBoxArea}
          className="cursor-text h-full absolute w-full z-30"
          style={{position: "relative"}}
        >
          {startPos && endPos && (
            <div
              style={calculateBoxStyle()}
              className="border border-primary rounded-[2px]"
            />
          )}
        </div>
      )}
    </>
  );
};

export default TextBoxCreate;
