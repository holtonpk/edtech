import React, {useEffect, useCallback, useRef} from "react";
import {usePresentation} from "@/context/presentation-context";
import {Icons} from "@/components/icons";
import {TextBoxType, Slide} from "@/config/data";
import {SlideMenu} from "./slide-menu";
import {set} from "zod";

const SlideSelector = ({shouldHideToolbar}: {shouldHideToolbar: boolean}) => {
  const {
    slideData,
    selectedSlide,
    setSelectedSlide,
    selectedTextBox,
    deleteSlide,
    createNewSlide,
    activeEdit,
    copySlide,
    selectedSlideRef,
    groupSelectedTextBoxes,
  } = usePresentation()!;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedSlide || !slideData) return;

    // see if element with class disableSelector is present

    const disableSelector =
      e.target instanceof Element
        ? e.target.classList.contains("disableSelector")
        : false;

    if (disableSelector) return;
    if (
      e.key === "Backspace" &&
      !activeEdit &&
      selectedSlideRef.current &&
      !groupSelectedTextBoxes
    ) {
      console.log("deleting", selectedSlideRef.current.id);
      deleteSlide(selectedSlideRef.current.id);
    }
    if (e.metaKey && e.key === "c" && selectedSlideRef.current) {
      console.log("copy", selectedSlideRef.current.id);
      copySlide(selectedSlideRef.current.id);
    }

    if (
      e.key === "ArrowUp" ||
      (e.key === "ArrowLeft" && selectedSlideRef.current)
    ) {
      if (slideData.slides.indexOf(selectedSlideRef.current!) === 0) return;
      setSelectedSlide(
        slideData.slides[
          slideData.slides.indexOf(selectedSlideRef.current!) - 1
        ]
      );
    }
    if (
      e.key === "ArrowDown" ||
      (e.key === "ArrowRight" && selectedSlideRef.current)
    ) {
      if (
        slideData.slides.indexOf(selectedSlideRef.current!) ===
        slideData.slides.length - 1
      )
        return;
      setSelectedSlide(
        slideData.slides[
          slideData.slides.indexOf(selectedSlideRef.current!) + 1
        ]
      );
    }
  };

  useEffect(() => {
    if (selectedTextBox || activeEdit) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEdit, selectedTextBox]);

  const slideContainer = React.useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  useEffect(() => {
    slideContainer.current?.addEventListener("scroll", () => {
      if (slideContainer.current?.scrollLeft !== 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }, []);

  const [width, setWidth] = React.useState(0);

  const calculateSize = () => {
    const slideArea = document.getElementById("slide-area");
    if (!slideArea) return;

    const slideAreaHeightReal = slideArea.getBoundingClientRect().height;
    const slideAreaWidthReal = slideArea.getBoundingClientRect().width;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let slideAreaHeight;
    let slideAreaWidth;

    if (shouldHideToolbar || mode === "default") {
      slideAreaHeight = vh - 84;
      slideAreaWidth = vw - 402;
    } else {
      slideAreaHeight = vh - 84;
      slideAreaWidth = vw - 80;
    }

    console.log("slideAreaHeight", slideAreaHeightReal, slideAreaHeight);
    console.log("slideAreaWidth", slideAreaWidthReal, slideAreaWidth);

    let newHeight = slideAreaHeight - 108;
    let newWidth = (slideAreaHeight - 108) * (16 / 9);

    if (newWidth > slideAreaWidth) {
      newWidth = slideAreaWidth;
      newHeight = slideAreaWidth * (9 / 16);
    }

    setWidth(newWidth);
  };

  React.useEffect(() => {
    window.addEventListener("resize", calculateSize);
    return () => {
      window.removeEventListener("resize", calculateSize);
    };
  }, []);

  const {mode} = usePresentation()!;

  React.useEffect(() => {
    calculateSize();
  }, [mode]);

  return (
    <div
      className=" h-[100px]  items-center justify-start  overflow-hidden flex flex-row relative bg-background  p-2 border shadow-md rounded-md"
      style={{width: width}}
    >
      <div
        id="slide-container"
        ref={slideContainer}
        className="h-full  w-full max-h-full relative overflow-scroll"
      >
        <div className="flex pr-16  flex-row w-fit  h-full justify-start items-start gap-4 z-20  relative ">
          <SlideMenu container={slideContainer} />
        </div>
      </div>
      {isScrolled && (
        <div className="absolute left-0 h-full  z-30 animate-in fade-in-0 duration-500">
          <div className="upload-row-edge-grad-left h-full w-20 z-30 pointer-events-none"></div>
        </div>
      )}
      <div className="absolute h-full right-0 flex">
        <div className=" w-20 h-full  upload-row-edge-grad-right z-30 pointer-events-none" />
        <button
          onClick={() => {
            createNewSlide();
            setTimeout(() => {
              slideContainer.current?.scrollTo({
                top: slideContainer.current?.scrollHeight,
                behavior: "smooth",
              });
            }, 100);
          }}
          className="hover:text-primary  rounded-r-0 py-6  p-2  z-30  flex items-center text-sm whitespace-nowrap bg-background  justify-center gap-2 hover:border-primary transition-colors duration-300"
        >
          <Icons.add className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SlideSelector;
