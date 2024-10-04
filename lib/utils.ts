import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Slide, TextBoxType, SlideImage} from "@/config/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const applyCommand = (
  textBoxId: string,
  commandId: string,
  commandValue: string
) => {
  // if text is highlighted, do not select text box content
  const selection = window.getSelection();
  if (selection && selection.toString() !== "") {
    // apply command to highlighted text
    document.execCommand(commandId, false, commandValue);
    return;
  }
  // select text box content
  const element = document.getElementById(`text-box-${textBoxId}`);
  if (!element) return;
  let range = document.createRange();
  range.selectNodeContents(element);
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
  // apply command to all text in text box
  document.execCommand(commandId, false, commandValue);
  selection.removeAllRanges();
};

export const determineIfActive = (textBoxId: string, tag: string) => {
  const element = document.getElementById(`ui-focus-text-box-${textBoxId}`)
    ?.childNodes[0].childNodes[0] as HTMLElement;
  if (!element) return false;
  const isActive = element.querySelector(tag) !== null;
  return isActive;
};

export function isTextBoxType(obj: any): obj is TextBoxType {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.text === "string" &&
    obj.position &&
    typeof obj.position.x === "number" &&
    typeof obj.position.y === "number" &&
    obj.size &&
    typeof obj.size.width === "number" &&
    typeof obj.rotation === "number" &&
    typeof obj.textBoxId === "string" &&
    typeof obj.fontSize === "number"
  );
}
export function isTextBoxTypeArray(obj: any): obj is TextBoxType[] {
  return Array.isArray(obj) && obj.every(isTextBoxType);
}

function isSlideImage(obj: any): obj is SlideImage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.imageId === "string" &&
    obj.image !== null &&
    obj.position &&
    typeof obj.position.x === "number" &&
    typeof obj.position.y === "number" &&
    obj.size &&
    typeof obj.size.width === "number" &&
    typeof obj.rotation === "number"
  );
}

function isSlideImageArray(obj: any): obj is SlideImage[] {
  return Array.isArray(obj) && obj.every(isSlideImage);
}

export function isSlide(obj: any): obj is Slide {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.background === "string" &&
    isTextBoxTypeArray(obj.textBoxes) &&
    isSlideImageArray(obj.images)
  );
}
