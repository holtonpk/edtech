import {Slide, SlideData, TextBoxType} from "@/config/data";

import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import PptxGenJS from "pptxgenjs";

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
