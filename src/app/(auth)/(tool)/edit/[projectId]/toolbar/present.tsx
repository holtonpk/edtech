"use client";
import React, {useCallback, useEffect} from "react";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Slide, TextBoxType} from "@/config/data";

function Present() {
  const handle = useFullScreenHandle();

  const {slideData} = usePresentation()!;

  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);

  const [selectorScale, setSelectorScale] = React.useState<number | undefined>(
    1
  );

  const presentationRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = document.body.clientWidth / 1000;
    setSelectorScale(calculateScale);
  }, []);

  useEffect(() => {
    // add event listener for keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (slideData && activeSlideIndex === slideData.slides.length - 1)
          return;
        setActiveSlideIndex(activeSlideIndex + 1);
      }
      if (e.key === "ArrowLeft") {
        if (activeSlideIndex === 0) return;
        setActiveSlideIndex(activeSlideIndex - 1);
      }
      if (e.code === "Space") {
        if (slideData && activeSlideIndex === slideData.slides.length - 1)
          return;
        setActiveSlideIndex(activeSlideIndex + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlideIndex, slideData]);

  return (
    <div>
      <Button
        onClick={handle.enter}
        variant={"outline"}
        className="bg-primary text-white"
      >
        <Icons.play className="h-3 w-3 mr-3" />
        Present
      </Button>
      {slideData && slideData.slides[activeSlideIndex] && (
        <FullScreen handle={handle}>
          <div
            className="bg-black w-full h-full flex items-center justify-center "
            style={{
              display: handle.active ? "flex" : "none",
            }}
          >
            <div
              ref={presentationRef}
              style={{
                background:
                  slideData?.slides[activeSlideIndex].background || "white",
                transform: `scale(${selectorScale}) `,
              }}
              className={`relative w-[1000px] z-20  overflow-hidden aspect-[16/9] p-6 flex items-center justify-center  text-black
                `}
            >
              {slideData?.slides?.[activeSlideIndex]?.backgroundImage?.path &&
                slideData.slides[activeSlideIndex].backgroundImage.path !==
                  "" && (
                  <div
                    className="absolute w-full h-full bg-cover bg-center z-10"
                    style={{
                      backgroundImage: `url(${slideData.slides[activeSlideIndex].backgroundImage.path})`,
                    }}
                  />
                )}
              {/* <div className="w-[1000px] b-b aspect-[16/9] absolute "> */}
              {slideData &&
                slideData.slides &&
                slideData.slides[activeSlideIndex].textBoxes &&
                slideData.slides[activeSlideIndex].textBoxes.map(
                  (textbox: TextBoxType, index: number) => (
                    <div
                      key={index}
                      className=" p-2 absolute pointer-events-none z-20"
                      style={{
                        top: textbox.position.y,
                        left: textbox.position.x,
                        height: "fit-content",
                        width: textbox.size.width,
                        transform: `rotate(${textbox.rotation}deg)`,
                        fontSize: `${textbox.fontSize}px`,
                      }}
                      dangerouslySetInnerHTML={{__html: textbox.text}}
                    />
                  )
                )}
              {slideData &&
                slideData.slides &&
                slideData.slides[activeSlideIndex].images &&
                slideData.slides[activeSlideIndex].images.map(
                  (image, index) => (
                    <div
                      key={index}
                      style={{
                        top: image.position.y,
                        left: image.position.x,
                        width: image.size.width,
                        transform: `rotate(${image.rotation}deg)`,
                      }}
                      className="p-2 h-fit w-fit absolute origin-center pointer-events-none z-20"
                    >
                      <img
                        src={image.image.path}
                        alt={image.image.title}
                        className="origin-center p-2 pointer-events-none h-full w-full"
                      />
                    </div>
                  )
                )}
              {/* </div> */}
            </div>
            {/* <Button className="absolute bottom-0" onClick={handle.exit}>
            Exit
          </Button> */}
          </div>
        </FullScreen>
      )}
    </div>
  );
}

export default Present;
