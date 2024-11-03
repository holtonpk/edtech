"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import SlideSelector from "./slide-selector";
import {set} from "zod";
import {usePresentation} from "@/context/presentation-context-basic";
export const PresentationCard = ({presId}: {presId: string}) => {
  const [title, setTitle] = useState<string | undefined>(undefined);

  // const [slide, setSlide] = useState<Slide | undefined>(undefined);

  // const dataIsFetched = useRef(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const docRef = doc(db, "presentations", presId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setSlide(docSnap.data().slideData.slides[0]);
  //       setTitle(docSnap.data().title);
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   };

  //   if (!dataIsFetched.current) {
  //     fetchData();
  //     dataIsFetched.current = true;
  //   }
  // }, [presId]);

  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [thumbScale, setThumbScale] = useState<number | undefined>(undefined);

  // const setScale = () => {
  //   const selectorContainer = selectorContainerRef.current;
  //   if (!selectorContainer) return;
  //   const calculateScale = selectorContainer.clientWidth / 1000;
  //   setThumbScale(calculateScale);
  // };
  // React.useEffect(() => {
  //   window.addEventListener("resize", setScale);
  //   return () => {
  //     window.removeEventListener("resize", setScale);
  //   };
  // }, []);

  // React.useEffect(() => {
  //   setScale();
  // }, [slide]);

  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [scale, setScale] = React.useState(1);

  // const calculateSize = () => {
  //   console.log("calculating size");

  //   const slideArea = document.getElementById("slide-area");
  //   if (!slideArea) return;

  //   const slideAreaWidthReal = slideArea.getBoundingClientRect().width;

  //   const windowWidth = window.innerWidth;

  //   let vw = window.innerWidth;
  //   let vh = window.innerHeight;
  //   let slideAreaHeight;
  //   let slideAreaWidth;

  //   if (windowWidth > 768) {
  //     slideAreaHeight = vh - 84;
  //     slideAreaWidth = vw - 80;
  //   } else {
  //     slideAreaWidth = slideAreaWidthReal;
  //     slideAreaHeight = slideAreaWidth * (9 / 16);
  //     setHeight(slideAreaHeight);
  //     setWidth(slideAreaWidth);
  //     setScale(slideAreaWidth / 960);
  //     return;
  //   }

  //   let newHeight = slideAreaHeight - 124;
  //   let newWidth = (slideAreaHeight - 124) * (16 / 9);

  //   if (newWidth > slideAreaWidth) {
  //     newWidth = slideAreaWidth;
  //     newHeight = slideAreaWidth * (9 / 16);
  //   }

  //   setHeight(newHeight);
  //   setWidth(newWidth);
  //   setScale(newWidth / 960);
  // };

  const calculateSize = () => {
    console.log("calculating size");

    const slideArea = document.getElementById("slide-area");
    if (!slideArea) return;
    const slideAreaWidthReal = slideArea.getBoundingClientRect().width;

    const availableWidth = window.innerWidth - 300;
    const availableHeight = window.innerHeight - 102;
    let slideHeight = availableWidth * (9 / 16);
    let slideWidth = availableWidth;

    if (slideHeight + 116 > availableHeight) {
      slideHeight = availableHeight - 116;
      slideWidth = slideHeight * (16 / 9);
      slideArea.style.width = `${slideWidth}px`;
    }

    setHeight(slideHeight);
    setWidth(slideWidth);
    setScale(slideWidth / 960);
  };

  React.useEffect(() => {
    window.addEventListener("resize", calculateSize);
    return () => {
      window.removeEventListener("resize", calculateSize);
    };
  }, []);

  React.useEffect(() => {
    calculateSize();
  }, []);

  const router = useRouter();

  const {selectedSlide} = usePresentation()!;

  return (
    <div
      style={{
        width: width,
      }}
      className="gap-4  flex-col flex  h-[calc(100vh-102px)] "
    >
      <div
        style={{
          width: width,
          height: height,
        }}
        className="flex flex-col  "
      >
        {selectedSlide && (
          <div
            ref={selectorContainerRef}
            style={{
              background: selectedSlide.background,
            }}
            onClick={() => {
              router.push(`/edit/${presId}`);
            }}
            className={`rounded-lg w-full relative aspect-[16/9] overflow-hidden p-6 flex items-center justify-center bg-white text-black   duration-300  border`}
          >
            {scale ? (
              <div
                className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
                style={{transform: `scale(${scale})`}}
              >
                {selectedSlide &&
                selectedSlide.backgroundImage &&
                selectedSlide.backgroundImage.path !== "undefined" ? (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${selectedSlide.backgroundImage.path})`,
                    }}
                  />
                ) : (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundColor: selectedSlide
                        ? selectedSlide.background
                        : "#ffffff",
                      opacity: selectedSlide?.backgroundOpacity
                        ? selectedSlide?.backgroundOpacity
                        : 1,
                    }}
                  />
                )}
                {selectedSlide.textBoxes &&
                  selectedSlide.textBoxes.map(
                    (textbox: TextBoxType, index: number) => (
                      <div
                        key={index}
                        className=" p-2 absolute pointer-events-none"
                        style={{
                          top: textbox.position.y,
                          left: textbox.position.x,
                          textAlign: textbox.textAlign
                            ? textbox.textAlign
                            : "left",

                          height: "fit-content",
                          width: textbox.size.width,
                          transform: `rotate(${textbox.rotation}deg)`,
                          fontSize: `${textbox.fontSize}px`,
                        }}
                        dangerouslySetInnerHTML={{__html: textbox.text}}
                      />
                    )
                  )}
                {selectedSlide.images &&
                  selectedSlide.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        top: image.position.y,
                        left: image.position.x,
                        width: image.size.width,
                        transform: `rotate(${image.rotation}deg)`,
                      }}
                      className="p-2 h-fit w-fit absolute origin-center pointer-events-none"
                    >
                      <img
                        src={image.image.path}
                        alt={image.image.title}
                        className="origin-center p-2 pointer-events-none h-full w-full"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <>no scale</>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          width: width,
        }}
        className=""
      >
        <SlideSelector areaWidth={width} />
      </div>
    </div>
  );
};
