import React, {useEffect, useCallback, useRef} from "react";
import {usePresentation} from "@/context/presentation-context";
import {Icons} from "@/components/icons";

import {SlideMenu} from "./slide-menu";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

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
    selectedSlideIndexRef,
    activeSlide,
    activeSlideRef,
    slideDataRef,
    setActiveSlide,
  } = usePresentation()!;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedSlide || !selectedSlideRef.current || !slideDataRef.current)
      return;

    // see if element with class disableSelector is present

    const disableSelector =
      e.target instanceof Element
        ? e.target.classList.contains("disableSelector")
        : false;

    if (disableSelector) return;

    if (
      e.key === "Backspace" &&
      selectedSlideRef.current &&
      activeSlideRef.current
    ) {
      console.log("deleting", selectedSlideRef.current.id);
      deleteSlide(selectedSlideRef.current.id);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "c" && selectedSlideRef.current) {
      console.log("copy", selectedSlideRef.current.id);
      copySlide(selectedSlideRef.current.id);
    }

    if (
      e.key === "ArrowUp" ||
      (e.key === "ArrowLeft" && selectedSlideRef.current)
    ) {
      e.preventDefault();
      if (slideDataRef.current.slides.indexOf(selectedSlideRef.current!) === 0)
        return;
      selectedSlideIndexRef.current = selectedSlideIndexRef.current - 1;
      setSelectedSlide(
        slideDataRef.current.slides[selectedSlideIndexRef.current]
      );
      setActiveSlide(
        slideDataRef.current.slides[selectedSlideIndexRef.current].id
      );
    }
    if (
      e.key === "ArrowDown" ||
      (e.key === "ArrowRight" && selectedSlideRef.current)
    ) {
      e.preventDefault();

      if (
        slideDataRef.current.slides.indexOf(selectedSlideRef.current!) ===
        slideDataRef.current.slides.length - 1
      )
        return;

      selectedSlideIndexRef.current = selectedSlideIndexRef.current + 1;
      setSelectedSlide(
        slideDataRef.current.slides[selectedSlideIndexRef.current]
      );
      setActiveSlide(
        slideDataRef.current.slides[selectedSlideIndexRef.current].id
      );
    }
  };

  useEffect(() => {
    if (selectedTextBox || activeEdit || !selectedSlideRef.current) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeEdit, selectedTextBox, selectedSlideRef]);

  const slideContainer = React.useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  useEffect(() => {
    const slideContainerElem = document.getElementById("slide-container");
    if (!slideContainer) return;

    slideContainerElem?.addEventListener("scroll", () => {
      if (slideContainerElem?.scrollLeft !== 0) {
        console.log("scrolled", slideContainerElem?.scrollLeft);
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

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (scrollLeft !== 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <div
      className=" h-[100px]  items-center justify-start  overflow-hidden flex flex-row relative bg-background p-2 pb-0 border shadow-md rounded-md "
      style={{width: width}}
    >
      <ScrollArea
        onScroll={onScroll}
        id="slide-container"
        viewPortRef={slideContainer}
        style={{width: width}}
        className="h-full  max-h-full  overflow-scroll pb-2 "
      >
        <div className="flex pr-16  flex-row w-fit  h-full justify-start items-start gap-4 z-20  relative ">
          <SlideMenu container={slideContainer} />
        </div>
        <ScrollBar
          orientation="horizontal"
          className=" absolute z-30 bottom-0 "
        />
      </ScrollArea>
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
                left: slideContainer.current?.scrollWidth,
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
