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

export function isSlideImage(obj: any): obj is SlideImage {
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

export function isSlideImageArray(obj: any): obj is SlideImage[] {
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

export function extractTextFromHTML(htmlString: string): string {
  // Create a DOMParser to parse the HTML string
  const parser = new DOMParser();

  // Parse the string as an HTML document
  const doc = parser.parseFromString(htmlString, "text/html");

  // Return the text content of the document
  return doc.body.textContent || "";
}

export const convertPxToInches = (px: number) => {
  // round to 3 decimal places
  return Math.round((px / 96) * 1000) / 1000;
};

export const imageUrlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

export function hexToRgba(hex: string, opacity: number): string {
  // Remove the leading # if present
  const cleanedHex = hex.replace("#", "");

  // Convert 3-digit hex to 6-digit hex (e.g., #f00 -> #ff0000)
  const fullHex =
    cleanedHex.length === 3
      ? cleanedHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanedHex;

  // Parse the r, g, and b values from the hex code
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Ensure opacity is between 0 and 1
  const validOpacity = Math.min(1, Math.max(0, opacity));

  console.log(opacity);
  console.log(`rgba(${r}, ${g}, ${b}, ${validOpacity})`);

  // Return the rgba value
  return `rgba(${r}, ${g}, ${b}, ${validOpacity})`;
}
