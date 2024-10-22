import {Timestamp, FieldValue} from "firebase/firestore";

export type Modes =
  | "themes"
  | "layout"
  | "aiRewrite"
  | "text"
  | "images"
  | "default";

export type position = {
  x: number;
  y: number;
};

export type size = {
  width: number;
  height: number;
};

export interface formatting {
  text: string;
  fontSize: number;
  fontColor: string;
  bgColor: string;
  textAlign: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
}

export interface UnformattedResponse {
  slides: {
    textBoxes: {
      text: string;
    }[];
  }[];
}

export interface TextBoxesToUpdate {
  textBoxId: string;
  value: Partial<TextBoxType>;
}

export interface FullSlideData {
  id: string;
  createdAt: Timestamp | FieldValue;
  slideData: {slides: Slide[]};
  recentColors: string[];
  title: string;
}

export interface SlideData {
  slides: Slide[];
  recentColors: string[];
  title: string;
}

export interface Slide {
  textBoxes: TextBoxType[];
  background: string;
  backgroundOpacity?: number;
  id: string;
  images: SlideImage[];
  title?: string;
  backgroundImage?: Image;
}

export interface SlideImage {
  imageId: string;
  image: Image;
  position: {x: number; y: number};
  size: {width: number};
  rotation: number;
}

export interface TextBoxType {
  boxType?: "heading" | "body";
  text: string;
  position: {x: number; y: number};
  size: {width: number};
  rotation: number;
  textBoxId: string;
  fontSize: number;
  textAlign?: "left" | "center" | "right" | "justify";
  textOpacity?: number;
}

export interface Size {
  width: number;
}

export interface Position {
  x: number;
  y: number;
}

export type AlignType = {
  direction: AlignDirection;
  justify: AlignmentJustify;
};

type AlignDirection = "row" | "column" | "none";

export type AlignmentJustify =
  | "justify-start"
  | "justify-end"
  | "justify-center"
  | "none";

export type UploadType = {
  file: File;
  title: string;
  id: string;
  path: string;
  type: "pdf" | "mp4" | "jpg" | "png" | "jpeg" | "mp3" | "doc" | "docx";
};

export type FileLocal = {
  id: string;
  file: File;
  uploadProgress: number;
  path: string;
  title: string;
  type:
    | "pdf"
    | "mp4"
    | "jpg"
    | "png"
    | "jpeg"
    | "mp3"
    | "doc"
    | "docx"
    | undefined;
};

export type Image = {
  title: string;
  path: string;
};

export const FILE_SIZE = 50;
export const MAX_FILE_SIZE_MB = FILE_SIZE * 1024 * 1024;

export interface CreatePresentationData {
  uploadText: string;
  description: string;
  format: PresentationFormat;
}

export interface PresentationFormat {
  numOfSlides: number;
}

export type DocumentColor = {
  color: string;
  usageId: string;
};

export type GeneratedText = {
  text: string;
  textBoxId: string;
  aiResponses: {
    text: string;
    id: string;
  }[];
};

export type Preset = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  background: string;
  buttonLabel: string;
  prompt?: string;
};
