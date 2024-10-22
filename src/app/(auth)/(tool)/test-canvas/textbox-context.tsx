"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {TextBoxType, Size, Position} from "@/config/data";

interface SlideContextType {
  // states -----------------------------
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  size: Size;
  setSize: React.Dispatch<React.SetStateAction<Size>>;
  isSelected: boolean;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  textBoxRef: React.RefObject<HTMLDivElement>;
  textBoxText: React.MutableRefObject<string | undefined>;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  activeDrag: boolean;
  setActiveDrag: React.Dispatch<React.SetStateAction<boolean>>;
  textBox: TextBoxType;
  isRotating: boolean;
  setIsRotating: React.Dispatch<React.SetStateAction<boolean>>;
  activeTransform: boolean;
  setActiveTransform: React.Dispatch<React.SetStateAction<boolean>>;
  textBoxId: string;
}

const TextBoxContext = createContext<SlideContextType | null>(null);

export function useTextBox() {
  return useContext(TextBoxContext);
}

interface Props {
  children?: React.ReactNode;
  textBox: TextBoxType;
}

export const TextBoxProvider = ({children, textBox}: Props) => {
  // states -----------------------------

  const [textBoxState, setTextBoxState] = useState<TextBoxType>(textBox);

  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [activeTransform, setActiveTransform] = useState<boolean>(false);

  //    the text value of the selected text box
  const [text, setText] = React.useState(textBox.text);

  const textBoxId = textBox.textBoxId;

  useEffect(() => {
    if (text !== textBoxState.text) {
      setText(textBoxState.text);
      textBoxText.current = textBoxState.text;
    }
    if (position !== textBoxState.position) {
      setPosition(textBoxState.position);
    }
    if (size !== textBoxState.size) {
      setSize(textBoxState.size);
    }
    if (rotation !== textBoxState.rotation) {
      setRotation(textBoxState.rotation);
    }
    if (fontSize !== textBoxState.fontSize) {
      setFontSize(textBoxState.fontSize);
    }
  }, [textBoxState]);

  const [position, setPosition] = React.useState<Position>({
    x: textBox.position.x,
    y: textBox.position.y,
  });

  const [size, setSize] = React.useState<Size>({
    width: textBox.size.width,
  });

  const [rotation, setRotation] = React.useState(textBox.rotation || 0);

  const [fontSize, setFontSize] = React.useState(textBox.fontSize);

  const textBoxRef = React.useRef<HTMLDivElement>(null);

  const [activeDrag, setActiveDrag] = React.useState<boolean>(false);

  // this  is used to track the entered text without updating the text state
  const textBoxText = React.useRef<string>(text);

  // track if this text box is selected

  const values = {
    textBoxState,
    setTextBoxState,
    text,
    setText,
    position,
    setPosition,
    size,
    setSize,
    isSelected,
    setIsSelected,
    textBoxRef,
    textBoxText,
    rotation,
    setRotation,
    fontSize,
    setFontSize,
    activeDrag,
    setActiveDrag,
    textBox,
    isRotating,
    setIsRotating,
    activeTransform,
    setActiveTransform,
    textBoxId,
  };

  return (
    <TextBoxContext.Provider value={values}>{children}</TextBoxContext.Provider>
  );
};

export default TextBoxContext;