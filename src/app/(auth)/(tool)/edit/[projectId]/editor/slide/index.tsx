import React, {useRef, useEffect, use} from "react";
import {Button} from "@/components/ui/button";
import {usePresentation} from "@/context/presentation-context";
import SlideSelector from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide-selector";
import {pdfjs} from "react-pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import TextBoxCreate from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/textbox-creator";
import {SlideImage, TextBoxType} from "@/config/data";
import {TextBoxProvider} from "@/context/textbox-context";
import {ImageProvider} from "@/context/image-context";
import {TextBoxToolBar} from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox-toolbar";
import Image from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/image";
import TextBox from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox";
import {Icons} from "@/components/icons";
import GroupSelection from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/multi-select";

const Slide = () => {
  const {
    selectedSlide,
    setSlideData,
    mode,
    activeGroupSelectedTextBoxes,
    activeGroupSelectedImages,
    activeSlide,
    setActiveSlide,
  } = usePresentation()!;

  const [shouldHideToolbar, setShouldHideToolbar] = React.useState(false);

  const calculateSize = () => {
    console.log("calculating size");

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

    return newWidth;
  };

  const calculateShouldHideToolbar = () => {
    const slideWidth = calculateSize();
    if (!slideWidth) return;
    const space = window.innerWidth - 80 - 400 - slideWidth;

    if (space < 320) {
      setShouldHideToolbar(true);
    } else {
      setShouldHideToolbar(false);
    }
  };

  useEffect(() => {
    calculateShouldHideToolbar();
  }, [mode]);

  React.useEffect(() => {
    window.addEventListener("resize", calculateShouldHideToolbar);
    return () => {
      window.removeEventListener("resize", calculateShouldHideToolbar);
    };
  }, []);

  const isGroupSelected =
    (activeGroupSelectedTextBoxes &&
      activeGroupSelectedTextBoxes?.length > 0) ||
    (activeGroupSelectedImages && activeGroupSelectedImages?.length > 0);

  return (
    <div
      className={`w-full h-full relative justify-between  items-start  gap-2 grid 
     default-slide-grid-layout
      ${
        shouldHideToolbar
          ? mode === "default"
            ? "default-slide-grid"
            : "open-menu-slide-grid"
          : "default-slide-grid-layout"
      }  
      `}
    >
      <div
        id={"slide-area"}
        className="w-full h-full flex justify-center   overflow-hidden "
      >
        <div className="flex flex-col justify-between items-center w-full gap-2   mx-auto ">
          {selectedSlide && (
            <SlideContainer shouldHideToolbar={shouldHideToolbar}>
              <>
                {selectedSlide.textBoxes &&
                  selectedSlide.textBoxes.map((textBox: TextBoxType) => (
                    <TextBoxProvider
                      key={selectedSlide.id + textBox.textBoxId}
                      textBox={textBox}
                      // textBoxId={textBox.textBoxId}
                      // slideId={selectedSlide.id}
                    >
                      <TextBox />
                    </TextBoxProvider>
                  ))}
                {selectedSlide.images &&
                  selectedSlide.images.map((image: SlideImage) => (
                    <ImageProvider
                      key={selectedSlide.id + image.imageId}
                      image={image}
                    >
                      <Image />
                    </ImageProvider>
                  ))}

                {isGroupSelected && <GroupSelection />}
              </>
            </SlideContainer>
          )}
          <div className="flex-grow flex items-centers justify-center w-full">
            <SlideSelector shouldHideToolbar={shouldHideToolbar} />
          </div>
        </div>
      </div>
      {/* <div className="w-full h-full "></div> */}
      <TextBoxToolBar shouldHideToolbar={shouldHideToolbar} />
    </div>
  );
};

export default Slide;

const SlideContainer = ({
  shouldHideToolbar,
  children,
}: {
  shouldHideToolbar: boolean;
  children: React.ReactNode;
}) => {
  const textBoxArea = useRef<HTMLDivElement>(null);

  const {
    setActiveEdit,
    selectedSlide,
    copySelected,
    cutSelected,
    pasteSelected,
    activeEdit,
    groupSelectedTextBoxes,
    setGroupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
    setGroupSelectedImages,
    groupSelectedImages,
    setActiveGroupSelectedImages,
    activeSlide,
    setActiveSlide,
  } = usePresentation()!;

  useEffect(() => {
    if (!textBoxArea.current) return;
    const textBox = textBoxArea.current;
    let mouseDownTime: number | null = null;

    const handleMouseDown = () => {
      mouseDownTime = Date.now();
    };

    const handleMouseUp = () => {
      if (mouseDownTime) {
        const mouseUpTime = Date.now();
        const timeDiff = mouseUpTime - mouseDownTime;

        if (timeDiff < 200) {
          // It's considered a click, execute your logic
          setActiveEdit(undefined);
          setGroupSelectedTextBoxes(undefined);
          setActiveGroupSelectedTextBoxes(undefined);
          setGroupSelectedImages(undefined);
          setActiveGroupSelectedImages(undefined);
          setActiveSlide(undefined);
        }

        mouseDownTime = null;
      }
    };

    textBox.addEventListener("mousedown", handleMouseDown);
    textBox.addEventListener("mouseup", handleMouseUp);

    return () => {
      textBox.removeEventListener("mousedown", handleMouseDown);
      textBox.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    textBoxArea,
    setActiveEdit,
    setGroupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
  ]);

  const [selectCoordinates, setSelectCoordinates] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isSelecting, setIsSelecting] = React.useState(false);

  React.useEffect(() => {
    const textBox = textBoxArea.current;
    if (!textBox) return;

    let timeoutId: NodeJS.Timeout | null = null;
    const handleMouseUp = () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear the timeout if mouse is released before 200ms
        timeoutId = null;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      const textBox = textBoxArea.current;
      if (!textBox) return;

      const rect = textBox.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      timeoutId = setTimeout(() => {
        setIsSelecting(true);
        setActiveEdit(undefined);
        const handleMouseMove = (e: MouseEvent) => {
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          const x = Math.min(startX, currentX);
          const y = Math.min(startY, currentY);
          const width = Math.abs(startX - currentX);
          const height = Math.abs(startY - currentY);

          setSelectCoordinates({x, y, width, height});
          // disable document selection
        };

        const handleMouseUp = () => {
          setIsSelecting(false);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }, 200);
    };

    textBox.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", handleMouseUp); // Listen globally for mouseup to clear timeout

    return () => {
      textBox.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setActiveEdit]);

  useEffect(() => {
    if (!isSelecting) {
      setSelectCoordinates({x: 0, y: 0, width: 0, height: 0});
      const anImageIsSelected =
        groupSelectedImages && groupSelectedImages.length > 0;
      const aTextBoxIsSelected =
        groupSelectedTextBoxes && groupSelectedTextBoxes.length > 0;
      const singleImageIsSelected =
        groupSelectedImages && groupSelectedImages.length === 1;
      const singleTextBoxIsSelected =
        groupSelectedTextBoxes && groupSelectedTextBoxes.length === 1;

      if (anImageIsSelected && aTextBoxIsSelected) {
        setActiveGroupSelectedTextBoxes(groupSelectedTextBoxes!);
        setActiveGroupSelectedImages(groupSelectedImages!);
      } else if (singleImageIsSelected && !aTextBoxIsSelected) {
        setActiveEdit(groupSelectedImages![0]);
      } else if (singleTextBoxIsSelected && !anImageIsSelected) {
        setActiveEdit(groupSelectedTextBoxes![0]);
      } else {
        setActiveGroupSelectedTextBoxes(
          aTextBoxIsSelected ? groupSelectedTextBoxes! : []
        );
        setActiveGroupSelectedImages(
          anImageIsSelected ? groupSelectedImages! : []
        );
      }
      setTimeout(() => {
        document.body.style.userSelect = "auto";
      }, 50);
    }
    if (isSelecting) {
      document.body.style.userSelect = "none";
    }
  }, [
    isSelecting,
    groupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
    groupSelectedImages,
    setActiveGroupSelectedImages,
  ]);

  useEffect(() => {
    if (!isSelecting) return;

    let selectedTextBoxes: string[] = [];
    selectedSlide?.textBoxes?.forEach((textBox) => {
      const textBoxElement = document.getElementById(
        `ui-text-box-${textBox.textBoxId}`
      );
      if (!textBoxElement) return;

      const textBoxRect = textBoxElement.getBoundingClientRect();
      const slideContainer = document.getElementById("slide-container");
      if (!slideContainer) return;

      const slideContainerRect = slideContainer.getBoundingClientRect();
      const textBoxX = textBoxRect.left - slideContainerRect.left;
      const textBoxY = textBoxRect.top - slideContainerRect.top;
      const textBoxWidth = textBoxRect.width;
      const textBoxHeight = textBoxRect.height;

      // Calculate the selection rectangle
      const selectX = selectCoordinates.x;
      const selectY = selectCoordinates.y;
      const selectWidth = selectCoordinates.width;
      const selectHeight = selectCoordinates.height;

      // Check if the text box intersects with the selection area
      const isIntersecting =
        textBoxX < selectX + selectWidth &&
        textBoxX + textBoxWidth > selectX &&
        textBoxY < selectY + selectHeight &&
        textBoxY + textBoxHeight > selectY;

      if (isIntersecting) {
        console.log("intersecting...........", textBox.textBoxId);
        selectedTextBoxes.push(textBox.textBoxId);
      }
    });

    let selectedImages: string[] = [];
    selectedSlide?.images?.forEach((image) => {
      const textBoxElement = document.getElementById(
        `ui-image-${image.imageId}`
      );
      if (!textBoxElement) return;

      const textBoxRect = textBoxElement.getBoundingClientRect();
      const slideContainer = document.getElementById("slide-container");
      if (!slideContainer) return;

      const slideContainerRect = slideContainer.getBoundingClientRect();
      const textBoxX = textBoxRect.left - slideContainerRect.left;
      const textBoxY = textBoxRect.top - slideContainerRect.top;
      const textBoxWidth = textBoxRect.width;
      const textBoxHeight = textBoxRect.height;

      // Calculate the selection rectangle
      const selectX = selectCoordinates.x;
      const selectY = selectCoordinates.y;
      const selectWidth = selectCoordinates.width;
      const selectHeight = selectCoordinates.height;

      // Check if the text box intersects with the selection area
      const isIntersecting =
        textBoxX < selectX + selectWidth &&
        textBoxX + textBoxWidth > selectX &&
        textBoxY < selectY + selectHeight &&
        textBoxY + textBoxHeight > selectY;

      if (isIntersecting) {
        selectedImages.push(image.imageId);
      }
    });

    setGroupSelectedImages(selectedImages);
    setGroupSelectedTextBoxes(selectedTextBoxes);
  }, [
    selectCoordinates,
    selectedSlide,
    isSelecting,
    setGroupSelectedTextBoxes,
  ]);

  useEffect(() => {
    // listen for delete key
    const handleKeyDown = (e: KeyboardEvent) => {
      // if textBoxRef is being edited, don't delete the text box. determine this by checking if the carrot is visible
      const selection = window.getSelection();

      const disableTextboxListeners =
        e.target instanceof Element
          ? e.target.classList.contains("disableTextboxListeners")
          : false;

      if (disableTextboxListeners) return;

      if (selection?.focusNode?.nodeName !== "#text") {
        if ((e.metaKey || e.ctrlKey) && e.key === "v") {
          pasteSelected();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copySelected, cutSelected, pasteSelected, groupSelectedTextBoxes]);

  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [scale, setScale] = React.useState(1);

  const calculateSize = () => {
    console.log("calculating size");

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

    setHeight(newHeight);
    setWidth(newWidth);
    setScale(newWidth / 1000);
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
      style={{
        background:
          selectedSlide &&
          (!selectedSlide.backgroundImage ||
            selectedSlide.backgroundImage.path === "undefined")
            ? selectedSlide.background
            : "#ffffff",
        width: width,
        height: height,
      }}
      className={` overflow-hidden  p-0 items-center justify-center relative text-black flex flex-col border border-foreground/10 rounded-md  z-[50] 
        ${isSelecting ? " cursor-crosshair" : ""}
        `}
    >
      {selectedSlide &&
        selectedSlide.backgroundImage &&
        selectedSlide.backgroundImage.path !== "undefined" && (
          <div
            className="absolute w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${selectedSlide.backgroundImage.path})`,
            }}
          />
        )}

      {/* <div className="absolute w-[100%] aspect-[16/9] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "></div> */}

      <div
        className="w-[1000px]  absolute aspect-[16/9] "
        style={{transform: `scale(${scale})`}}
      >
        <div
          ref={textBoxArea}
          id="slide-container"
          className="w-full h-full absolute "
        />
        {children}
      </div>

      {isSelecting && (
        <div
          className={`absolute border border-primary rounded-sm bg-primary/5`}
          style={{
            top: selectCoordinates.y,
            left: selectCoordinates.x,
            width: selectCoordinates.width,
            height: selectCoordinates.height,
          }}
        />
      )}
    </div>
  );
};
