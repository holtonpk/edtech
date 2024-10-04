import React, {useRef, useEffect} from "react";
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
import TextboxActions from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/textbox-actions";
import GroupSelection from "@/src/app/(auth)/(tool)/edit/[projectId]/editor/slide/textbox/multi-select";

const Slide = () => {
  const {selectedSlide, setSlideData, mode, activeGroupSelectedTextBoxes} =
    usePresentation()!;

  return (
    <div
      className={`w-full h-full relative justify-center  items-start  gap-2 grid 
      ${mode === "default" ? "default-slide-grid" : "open-menu-slide-grid"}
    `}
    >
      <div className="flex flex-col justify-between items-center w-full gap-2  ">
        {selectedSlide && (
          <SlideContainer>
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
                  <ImageProvider key={image.imageId} image={image}>
                    <Image />
                  </ImageProvider>
                ))}

              {activeGroupSelectedTextBoxes &&
                activeGroupSelectedTextBoxes.length > 1 && <GroupSelection />}
            </>
          </SlideContainer>
        )}
        <SlideSelector />
      </div>

      <TextBoxToolBar />
    </div>
  );
};

export default Slide;

const SlideContainer = ({children}: {children: React.ReactNode}) => {
  const textBoxArea = useRef<HTMLDivElement>(null);

  const {
    setActiveEdit,
    selectedSlide,
    copyTextBox,
    cutTextBox,
    pasteTextBox,
    activeEdit,
    groupSelectedTextBoxes,
    setGroupSelectedTextBoxes,
    setActiveGroupSelectedTextBoxes,
    selectedTextBox,
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
      setActiveGroupSelectedTextBoxes(groupSelectedTextBoxes);
      setTimeout(() => {
        console.log("setting user select to auto");
        document.body.style.userSelect = "auto";
      }, 5000);

      // setGroupSelectedTextBoxes(undefined);
    }
    if (isSelecting) {
      console.log("setting user select to none");

      document.body.style.userSelect = "none";
    }
  }, [isSelecting, groupSelectedTextBoxes, setActiveGroupSelectedTextBoxes]);

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
        selectedTextBoxes.push(textBox.textBoxId);
      }
    });

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
        if (e.metaKey && e.key === "v") {
          pasteTextBox();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copyTextBox, cutTextBox, pasteTextBox, groupSelectedTextBoxes]);

  return (
    <div
      style={{background: selectedSlide ? selectedSlide.background : "#ffffff"}}
      className={`w-[1000px] overflow-hidden  aspect-[16/9] p-0 relative text-black flex flex-col border border-foreground/10 rounded-md  z-[50] 
        ${isSelecting ? " cursor-crosshair" : ""}
        `}
    >
      <div
        ref={textBoxArea}
        id="slide-container"
        className="w-full h-full absolute"
      />

      {children}

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
