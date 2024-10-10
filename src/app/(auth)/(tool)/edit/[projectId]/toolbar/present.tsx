"use client";
import React, {useCallback, useEffect} from "react";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Slide, TextBoxType} from "@/config/data";

function Present() {
  const handle = useFullScreenHandle();

  const {slideData, selectedSlideIndexRef, selectedSlide} = usePresentation()!;

  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number>(0);

  useEffect(() => {
    if (selectedSlide)
      setActiveSlideIndex(slideData?.slides.indexOf(selectedSlide) || 0);
  }, [selectedSlide]);

  const [selectorScale, setSelectorScale] = React.useState<number | undefined>(
    1
  );

  const presentationRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sw = screen.width;
    const sh = screen.height;

    // Define the container's fixed width and aspect ratio (16:9)
    const containerWidth = 1000;
    const containerHeight = containerWidth * (9 / 16);

    let calculateScale = 1;

    const scaleByWidth = sw / containerWidth;
    const scaleByHeight = sh / containerHeight;

    if (containerHeight * scaleByWidth < sh) {
      calculateScale = scaleByWidth;
    } else {
      calculateScale = scaleByHeight;
    }

    setSelectorScale(calculateScale);
  }, [handle.active]);

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

  const backgroundImagePath =
    slideData?.slides?.[activeSlideIndex]?.backgroundImage?.path;

  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  const [showSlideMenu, setShowSlideMenu] = React.useState<boolean>(false);

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
        <FullScreen handle={handle} className="">
          <div
            className=" w-full h-full flex items-center justify-center "
            style={{
              display: handle.active ? "flex" : "none",
            }}
          >
            <div
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => {
                setShowMenu(false);
                setShowSlideMenu(false);
              }}
              className="absolute bottom-0 left-0  h-[300px] w-[300px]  z-30 flex p-4"
            >
              {showMenu && (
                <>
                  {showSlideMenu && (
                    <button
                      onClick={() => setShowSlideMenu(false)}
                      className=" top-0 left-0 absolute w-full h-full  cursor-default"
                    ></button>
                  )}
                  <div className="slide-top flex items-center rounded-md bg-background/20 hover:bg-background/70 group transition-colors duration-300 blurBack border hover:border-border border-border/30 mt-auto p-2 ">
                    {showSlideMenu && (
                      <button
                        onClick={() => setShowSlideMenu(false)}
                        className="z-20 top-0 left-0 absolute w-full h-full  cursor-default"
                      ></button>
                    )}
                    <div className="flex items-center gap-1 z-30 relative">
                      <button
                        onClick={() => {
                          setShowSlideMenu(false);
                          if (activeSlideIndex === 0) return;
                          setActiveSlideIndex(activeSlideIndex - 1);
                        }}
                        className="rounded-full p-1 hover:bg-muted "
                      >
                        <Icons.chevronLeft className="h-6 w-6" />
                      </button>

                      <div className="h-fit w-fit relative">
                        <button
                          onClick={() => setShowSlideMenu(!showSlideMenu)}
                          className="transition-colors duration-300 group-hover:bg-background group-hover:border-border border border-transparent rounded-md py-1 w-[50px] relative flex items-center justify-center"
                        >
                          {activeSlideIndex + 1}
                        </button>

                        {showSlideMenu && (
                          <div className=" absolute z-40 w-72 h-fit rounded-md border bg-popover left-4 p-2 text-popover-foreground shadow-md outline-none bottom-[110%] -transslate-y-full animate-in  fade-out-0 fade-in-0  zoom-in-95  slide-in-from-bottom-2">
                            {slideData &&
                              slideData.slides.map((slide: Slide, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setActiveSlideIndex(index);
                                    setShowSlideMenu(false);
                                  }}
                                  className={`${
                                    activeSlideIndex === index
                                      ? "bg-muted-foreground/20 "
                                      : "bg-background hover:bg-muted-foreground/10"
                                  } p-2 rounded-md my-1 cursor-pointer max-w-full overflow-hidden text-ellipsis whitespace-nowrap`}
                                >
                                  Slide {index + 1}{" "}
                                  {slide.title &&
                                    slide.title !== "" &&
                                    " - " + slide.title}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setShowSlideMenu(false);
                          if (activeSlideIndex === slideData.slides.length - 1)
                            return;
                          setActiveSlideIndex(activeSlideIndex + 1);
                        }}
                        className="rounded-full p-1 hover:bg-muted "
                      >
                        <Icons.chevronRight className="h-6 w-6" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handle.exit();
                      }}
                      className="ml-4 group-hover:border-border border border-transparent p-1 rounded-[6px] transition-colors duration-300 group-hover:bg-background hover:text-primary px-2  flex items-center gap-1 z-30 relative"
                    >
                      <Icons.exitFullScreen className="h-5 w-5" />
                      Exit
                    </button>
                  </div>
                </>
              )}
            </div>
            <div
              ref={presentationRef}
              style={{
                background:
                  slideData?.slides[activeSlideIndex].background || "white",
                transform: `scale(${selectorScale}) `,
              }}
              className={`relative w-[1000px] z-20 overflow-hidden aspect-[16/9] p-6 flex items-center justify-center  text-black
                `}
            >
              {backgroundImagePath && backgroundImagePath !== "undefined" && (
                <div
                  className="absolute w-full h-full bg-cover bg-center z-10"
                  style={{
                    backgroundImage: `url(${backgroundImagePath})`,
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
