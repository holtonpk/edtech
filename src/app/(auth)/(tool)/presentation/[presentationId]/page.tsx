"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, SlideData, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {PresentationProvider} from "@/context/presentation-context-basic";
import {PresentationCard} from "./presentation-card";
import Background from "./background";
import ToolBar from "./toolbar/toolbar";
import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import PptxGenJS from "pptxgenjs";
import {SaveToCanvaFull, SaveToCanva} from "./exports/canva";
import {SaveToGoogleSlides} from "./exports/google-slides";
import {SaveToPowerPoint} from "./exports/power-point";
import {Download} from "./exports/download";
import {Themes} from "./themes";
import AuthModal from "@/components/auth/auth-modal";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import Waitlist from "./waitlist";
const Presentation = ({params}: {params: {presentationId: string}}) => {
  const {presentationId} = params;

  return (
    <div className="h-fit md:h-screen w-screen  flex flex-col overflow-hidden gap-2">
      {/* <NewProjectMessage /> */}
      <Background />
      {/* <NavBar /> */}
      <AuthModal />
      <div className="h-screen w-screen overflow-hidden">
        <PresentationProvider projectId={presentationId}>
          <ToolBar />
          <div className=" h-full grid grid-flow-col p-4 max-w-[1800px]  mx-auto rounded-md overflow-hidden  max-w-screen gap-4  ">
            <div
              id="slide-area"
              className=" gap-2 w-[calc(100vw-300px)] overflow-hidden relative "
            >
              <PresentationCard presId={presentationId} />
            </div>
            <div className="flex flex-col gap-4 w-full flex-grow ">
              <Themes />

              <div className="flex gap-4 flex-col p-4 h-fit bg-background blurBack rounded-md shadow-lg border w-full ">
                <div className="grid gap-1 ">
                  <h1 className=" poppins-bold text-xl ">Edit</h1>
                  <p>Open in your favorite app to edit further</p>
                </div>
                <div className="grid  gap-4 ">
                  <SaveToGoogleSlides />
                  <SaveToCanva />
                  <SaveToPowerPoint />
                  <Download />
                </div>
              </div>
              <Waitlist />
            </div>
          </div>
        </PresentationProvider>
      </div>
    </div>
  );
};

export default Presentation;

export const createPPTX = async (slideData: SlideData) => {
  let pres = new PptxGenJS();

  for (const slide of slideData.slides) {
    let slideFile = pres.addSlide(slide.title);

    if (slide.backgroundImage && slide.backgroundImage.path !== "undefined") {
      const imageData = (await imageUrlToBase64(
        slide.backgroundImage.path
      )) as string;

      slideFile.background = {data: imageData};
    } else {
      slideFile.background = {color: slide.background || "#ffffff"};
    }

    slide.textBoxes.forEach((textBox) => {
      const textBoxUi = document.getElementById(
        "mini-slide-textbox-" + textBox.textBoxId
      );
      if (!textBoxUi) return;
      const textBoxUiRect = textBoxUi.getBoundingClientRect();

      const paragraph = textBoxUi.querySelector("p");
      if (!paragraph) return;
      const font = paragraph?.querySelector("font");
      const fontFace = font?.getAttribute("face") || "Arial";
      const color = font?.getAttribute("color");

      // create an element for the text
      const element = document.createElement("div");
      element.style.position = "fixed";

      element.style.width = textBox.size.width + "px";
      element.style.fontSize = textBox.fontSize + "px";
      element.style.textAlign = textBox.textAlign ? textBox.textAlign : "left";
      element.style.height = "fit-content";
      element.innerHTML = textBox.text;
      element.style.lineHeight = "1.15";
      element.style.padding = ".05in .1in .05in .1in";
      document.body.appendChild(element);
      const height = element.getBoundingClientRect().height;

      // remove the element
      document.body.removeChild(element);

      const isBold = textBoxUi?.querySelector("b") !== null;
      const isItalic = textBoxUi?.querySelector("i") !== null;
      const isUnderline = textBoxUi?.querySelector("u") !== null;
      const isStrike = textBoxUi?.querySelector("strike") !== null;

      console.log("isBold", isBold);
      console.log("isItalic", isItalic);
      console.log("isUnderline", isUnderline);
      console.log("isStrike", isStrike);

      slideFile.addText(extractTextFromHTML(textBox.text), {
        x: convertPxToInches(textBox.position.x),
        y: convertPxToInches(textBox.position.y),
        w: convertPxToInches(textBox.size.width),
        h: convertPxToInches(height),
        fontSize: textBox.fontSize / 1.44,
        color: color || "#000000",
        fontFace: fontFace,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline ? {style: "sng"} : {style: "none"},
        strike: isStrike,
        align: textBox.textAlign ? textBox.textAlign : "left",
        // transparency: textBox.textOpacity ? textBox.textOpacity * 100 : 0,
      });
    });

    for (const image of slide.images) {
      const element = document.createElement("img");
      element.src = image.image.path;
      element.style.position = "fixed";
      element.style.width = image.size.width + "px";
      element.style.height = "auto";
      // element.style.zIndex = "9999";
      // element.style.top = "0px";
      // element.style.left = "0px";

      document.body.appendChild(element);
      const height = element.getBoundingClientRect().height;
      document.body.removeChild(element);

      // create base64 encoded image

      const imageData = (await imageUrlToBase64(image.image.path)) as string;

      slideFile.addImage({
        data: imageData,
        x: convertPxToInches(image.position.x),
        y: convertPxToInches(image.position.y),
        w: convertPxToInches(image.size.width),
        h: convertPxToInches(height),
      });
    }
  }

  return pres;
};
