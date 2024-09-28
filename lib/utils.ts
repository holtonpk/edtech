import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

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
};
