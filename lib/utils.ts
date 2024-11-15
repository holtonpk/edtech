import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {FullSlideData, Slide, TextBoxType, SlideImage} from "@/config/data";
import {Timestamp} from "firebase/firestore";
import {UserData} from "@/context/user-auth";
import {Metadata} from "next";
import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {db} from "@/config/firebase";

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

export const formatTimeDifference = (timestamp: Timestamp): string => {
  const now = new Date();
  const timestampDate = timestamp.toDate();
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHrs = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHrs / 24);
  const diffWeeks = Math.round(diffDays / 7);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hr${diffHrs === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }
};

export const createNewBlankPresentation = async (currentUser: UserData) => {
  const blankPresentation: FullSlideData = {
    slideData: {
      slides: [
        {
          textBoxes: [
            {
              textBoxId: "0.5025385440330408",
              fontSize: 40,
              rotation: 0,
              size: {width: 600},
              position: {x: 20, y: 20},
              text: '<p><b><font color="#000000">New presentation</font></b></p>',
              boxType: "heading",
            },
            {
              size: {width: 600},
              position: {x: 20, y: 100},
              text: '<p><font color="#000000">Add subheading here</font></p>',
              rotation: 0,
              textBoxId: "0.6930778945417186",
              fontSize: 24,
              boxType: "body",
            },
          ],
          background: "#ffffff",
          id: "1",
          images: [],
          shapes: [],
        },
      ],
    },
    recentColors: [],
    title: "Untitled presentation",
    id: Math.random().toString(),
    createdAt: serverTimestamp(),
  };

  const saveToFirebase = async () => {
    const docRef = await addDoc(
      collection(db, "presentations"),
      blankPresentation
    );
    const presentationId = docRef.id;

    // update user storage with the new presentation
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser?.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedPresentations = [...userData.presentations, presentationId];
      await setDoc(userRef, {...userData, presentations: updatedPresentations});
    }

    return presentationId;
  };

  const projectId = await saveToFirebase();
  return projectId;
};

export function constructMetadata({
  title = "Frizzle AI",
  description = "Turn anything into a presentation",
  image = `/image/favicon.ico`,
}: // image = `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
{
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
    },
    metadataBase: new URL("https://www.usefrizzle.ai/"),
    themeColor: "#FFF",
  };
}
