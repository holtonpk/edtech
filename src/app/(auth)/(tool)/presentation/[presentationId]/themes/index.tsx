"use client";
import React, {useEffect} from "react";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {db} from "@/config/firebase";
import {doc, getDoc, or, updateDoc} from "firebase/firestore";
import {usePresentation} from "@/context/presentation-context-basic";
import {Icons} from "@/components/icons";

export const Themes = () => {
  const {setSlideData, slideDataRef, selectedSlide, addImageToBackground} =
    usePresentation()!;

  const [defaultImages, setDefaultImages] = React.useState<ImageType[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const userRef = doc(db, "users", "TV8IByKFFFaupS1HV4qg6Xaw1Xc2");
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const defaultImages = userSnap.data().userImagesLocal;
        setDefaultImages(defaultImages);
      }
    };
    fetchImages();
  }, []);

  const addImageToAllSlides = (image: string, id: string) => {
    if (slideDataRef.current && selectedSlide) {
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
          return {
            ...slide,
            backgroundImage: {path: image, title: id},
          };
        }),
      };
      setSlideData(updatedSlideData);
    }
  };

  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );

  const [isScrolled, setIsScrolled] = React.useState(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (scrollLeft !== 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <div className="flex gap-2 flex-col p-4 h-fit bg-background blurBack rounded-md shadow-lg border max-w-full ">
      <div className="grid  ">
        <h1 className=" poppins-bold text-xl ">Themes</h1>
        <p>Select a theme for your presentation</p>
      </div>
      <div onScroll={onScroll} className="max-w-[390px] overflow-scroll">
        <div className="absolute right-0 h-full  z-30 animate-in fade-in-0 duration-500">
          <div className="upload-row-edge-grad-right h-full w-20 z-30 pointer-events-none"></div>
        </div>
        {isScrolled && (
          <div className="absolute left-0 h-full  z-30 animate-in fade-in-0 duration-500">
            <div className="upload-row-edge-grad-left h-full w-20 z-30 pointer-events-none"></div>
          </div>
        )}
        <div className="flex gap-2 w-fit ">
          {presetBackgrounds.map((imagePath: string, index) => (
            <button
              key={imagePath}
              onClick={() => {
                addImageToAllSlides(imagePath, `preset-${index}`);
                setSelectedImage(imagePath);
                // copy path to clipboard
                navigator.clipboard.writeText(imagePath);
              }}
              className={`h-16 aspect-video bg-muted rounded-md overflow-hidden border-2 relative
                ${
                  selectedSlide?.backgroundImage &&
                  selectedSlide?.backgroundImage.path === imagePath
                    ? "border-primary"
                    : "border-border hover:border-primary"
                }
                `}
            >
              {selectedSlide?.backgroundImage &&
                selectedSlide?.backgroundImage.path === imagePath && (
                  <div className="p-1 absolute left-1 bottom-1 h-fit w-fit bg-primary rounded-full">
                    <Icons.check className="w-2 h-2 text-white" />
                  </div>
                )}

              <div
                className="w-full h-full bg-cover bg-center "
                style={{
                  backgroundImage: `url(${imagePath})`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const presetBackgrounds = [
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/pzxzor?alt=media&token=86e9acac-3e5f-4f06-b955-806c9be6e32d",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/4qpi?alt=media&token=ee1f71c6-b80e-4463-997e-938c31e24940",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/otvc5m?alt=media&token=f1dc0676-b875-4d00-93db-cd0f161c3c47",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/zw1cd9?alt=media&token=9fbbe23c-a9e7-4eae-861e-03512203733e",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/e2tqgd?alt=media&token=47c03881-757f-4005-8da0-31e405d5e773",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/tg93c4?alt=media&token=f29b718d-564c-4baa-b85a-21c7dc4fc3ca",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/2djcp3j?alt=media&token=9376db25-934a-4ecf-aeac-c7ab52b5df41",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/7vx6po?alt=media&token=eb7d2c33-5196-45e1-9fd7-438176acba89",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/viodd?alt=media&token=ad142b16-3beb-4b77-9df2-61f20f5d96f0",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/f40w7u?alt=media&token=963dab07-9a2b-48a9-a475-5ec165673f0b",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/f1qvo?alt=media&token=c3df8926-bbcd-4102-bdb5-ce57677464f6",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/h8uhdo?alt=media&token=6c411124-bd75-4f58-a0ff-6c0cec49cbd0",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/t0f668?alt=media&token=15f67397-42ae-4b63-95e6-971ac3a68036",
  "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/zl6y3l?alt=media&token=6d43ab26-25fc-44d6-96a4-3e3a8e97fa64",
];
