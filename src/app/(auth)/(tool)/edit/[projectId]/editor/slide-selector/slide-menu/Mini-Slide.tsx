import React, {forwardRef, HTMLAttributes} from "react";
import type {UniqueIdentifier} from "@dnd-kit/core";
import classNames from "classnames";
import {SlideData, Slide, TextBoxType, SlideImage} from "@/config/data";
import {usePresentation} from "@/context/presentation-context";
import {Icons} from "@/components/icons";
import styles from "./Slide.module.css";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {set} from "zod";

export enum Position {
  Before = -1,
  After = 1,
}

export enum Layout {
  Horizontal = "horizontal",
  Vertical = "vertical",
  Grid = "grid",
}

export interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, "id"> {
  active?: boolean;
  clone?: boolean;
  insertPosition?: Position;
  id: UniqueIdentifier;
  index?: number;
  onRemove?(): void;
  slide: Slide | undefined;
}

export const MiniSlide = forwardRef<HTMLLIElement, Props>(function Page(
  {id, index, active, clone, insertPosition, onRemove, style, slide, ...props},
  ref
) {
  const {
    selectedSlide,
    setSelectedSlide,
    setActiveEdit,
    setActiveGroupSelectedTextBoxes,
    setGroupSelectedTextBoxes,
    setGroupSelectedImages,
    setActiveGroupSelectedImages,
    selectedSlideIndexRef,
    activeSlide,
    setActiveSlide,
  } = usePresentation()!;

  const [selectorScale, setSelectorScale] = React.useState<number | undefined>(
    undefined
  );

  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const setScale = () => {
    const selectorContainer = selectorContainerRef.current;
    if (!selectorContainer) return;
    const calculateScale = selectorContainer.clientWidth / 1000;
    setSelectorScale(calculateScale);
  };
  React.useEffect(() => {
    window.addEventListener("resize", setScale);
    return () => {
      window.removeEventListener("resize", setScale);
    };
  }, []);

  React.useEffect(() => {
    setScale();
  }, [slide]);

  const [open, setOpen] = React.useState(false);

  const [showMenuTrigger, setShowMenuTrigger] = React.useState(false);

  const slideIsActive = slide && activeSlide === slide.id;

  return (
    <li
      className={classNames(
        styles.Wrapper,
        active && styles.active,
        clone && styles.clone,
        insertPosition === Position.Before && styles.insertBefore,
        insertPosition === Position.After && styles.insertAfter,
        styles.horizontal,
        "h-full relative "
      )}
      style={style}
      ref={ref}
      onMouseEnter={() => setShowMenuTrigger(true)}
      onMouseLeave={() => setShowMenuTrigger(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={`absolute top-2 right-2 z-40 rounded-full py-0 px-2  transition-colors duration-500
            ${
              (showMenuTrigger && !clone && !active) || open
                ? "visible"
                : "invisible"
            }
            ${open ? "bg-primary" : "bg-black/70  hover:bg-primary"}
            `}
        >
          <Icons.ellipsis className="h-4 w-4  text-background " />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="p-0 overflow-hidden py-2"
        >
          {slide && (
            <SelectorToolbar slide={slide} setOpen={setOpen} index={index} />
          )}
        </PopoverContent>
      </Popover>
      {!active && !clone && (
        <span className=" absolute bottom-0 p-2 px-3 pb-1 left-0 text-[12px] poppins-regular z-40 w-full overflow-hidden text-ellipsis h-fit whitespace-nowrap">
          {index} {slide?.title && ` - ${slide.title}`}
        </span>
      )}

      {slide && (
        <button
          className={styles.Page}
          data-id={id.toString()}
          {...props}
          id={slide.id}
        >
          <div
            onClick={() => {
              setSelectedSlide(slide);
              selectedSlideIndexRef.current = index ? index - 1 : 0;
              setActiveEdit(undefined);
              setActiveGroupSelectedTextBoxes(undefined);
              setGroupSelectedTextBoxes(undefined);
              setGroupSelectedImages(undefined);
              setActiveGroupSelectedImages(undefined);
              setActiveSlide(slide.id);
            }}
            ref={selectorContainerRef}
            // style={{
            //   background: slide.background,
            // }}
            className={`rounded-lg h-[80px]  overflow-hidden  relative aspect-[16/9] p-6 flex items-center justify-center bg-white text-black  transition-colors duration-300 cursor-pointer border-4
${
  slideIsActive
    ? "border-primary"
    : selectedSlide?.id === slide.id
    ? "border-primary/40"
    : "border-border hover:border-primary/30"
}

`}
          >
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={
                slide &&
                slide.backgroundImage &&
                slide.backgroundImage.path !== "undefined"
                  ? {
                      backgroundImage: `url(${slide.backgroundImage.path})`,
                    }
                  : {
                      background: slide.background,
                    }
              }
            />

            {selectorScale ? (
              <div
                className="w-[1000px] aspect-[16/9] absolute overflow-hidden"
                style={{transform: `scale(${selectorScale})`}}
              >
                {slide.textBoxes &&
                  slide.textBoxes.map((textbox: TextBoxType, index: number) => (
                    <div
                      key={index}
                      className=" p-2 absolute pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
                      style={{
                        top: textbox.position.y,
                        left: textbox.position.x,
                        height: "fit-content",
                        width: textbox.size.width + 20,
                        transform: `rotate(${textbox.rotation}deg)`,
                      }}
                    >
                      <div
                        id={"mini-slide-textbox-" + textbox.textBoxId}
                        className="h-fit w-full relative  whitespace-pre-wrap break-words overflow-hidden pointer-events-none text-left"
                        dangerouslySetInnerHTML={{__html: textbox.text}}
                        style={{
                          fontSize: textbox.fontSize,
                        }}
                      />
                    </div>
                  ))}
                {slide.images &&
                  slide.images.map((image, index) => (
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
        </button>
      )}
    </li>
  );
});

const SelectorToolbar = ({
  slide,
  setOpen,
  index,
}: {
  slide: Slide;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  index: number | undefined;
}) => {
  const [editTitle, setEditTitle] = React.useState(false);
  const [title, setTitle] = React.useState<string | undefined>(slide.title);

  const {
    setSlideData,
    slideDataRef,
    createNewSlide,
    setSelectedSlide,
    deleteSlide,
  } = usePresentation()!;

  const updateSlideTitle = () => {
    if (!slideDataRef.current || !title) return;
    const updatedSlide = {...slide, title};
    const newSlideData = slideDataRef.current.slides.map((s) => {
      if (s.id === slide.id) {
        return updatedSlide;
      }
      return s;
    });
    setSlideData({...slideDataRef.current, slides: newSlideData});
    setTitle(title);
    setEditTitle(false);
  };

  const duplicateSlide = () => {
    if (!slideDataRef.current) return;
    let copiedSlide = slideDataRef.current.slides.filter(
      (oldSlide) => oldSlide.id === slide.id
    )[0];

    const copiedTextBoxes = copiedSlide.textBoxes.map(
      (textBox: TextBoxType) => ({
        ...textBox,
        textBoxId: Math.random().toString(),
      })
    );

    const copiedDataImage = copiedSlide.images.map((image: SlideImage) => ({
      ...image,
      imageId: Math.random().toString(),
    }));

    copiedSlide = {
      ...copiedSlide,
      id: Math.random().toString(),
      textBoxes: copiedTextBoxes,
      images: copiedDataImage,
    };

    setSlideData({
      ...slideDataRef.current,
      slides: [
        ...slideDataRef.current.slides.slice(
          0,
          index ? index : slideDataRef.current.slides.length
        ),
        copiedSlide,
        ...slideDataRef.current.slides.slice(
          index ? index : slideDataRef.current.slides.length
        ),
      ],
    });

    setSelectedSlide(copiedSlide);
  };

  return (
    <div className="flex flex-col ">
      <div className="p-2 py-2">
        {editTitle ? (
          <div className=" overflow-hidden w-full">
            <input
              value={title}
              onBlur={updateSlideTitle}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="text-lg disableSelector noFocus border-primary w-[75%] max-w-full px-4 py-1 poppins-bold"
            />
          </div>
        ) : (
          <button
            onClick={() => setEditTitle(true)}
            className="flex items-center group w-fit max-w-full   px-4"
          >
            <span className="group-hover:underline font-bold text-lg poppins-bold whitespace-nowrap overflow-hidden w-fit  max-w-full text-ellipsis">
              {title || "Add slide title"}
            </span>
            <div className=" h-fit w-fit hover:bg-muted rounded-[12px] ml-2 flex items-center justify-center p-2">
              <Icons.pencil className="h-5 w-5 " />
            </div>
          </button>
        )}
      </div>
      <div className="h-[1px] w-full bg-border"></div>
      <button
        onClick={() => {
          createNewSlide(index);
          setOpen(false);
        }}
        className="flex items-center w-full p-2 hover:bg-muted poppins-regular px-4"
      >
        <Icons.addPage className="h-4 w-4 mr-2" />
        Add slide
      </button>
      <button
        onClick={() => {
          duplicateSlide();
          setOpen(false);
        }}
        className="flex items-center w-full p-2 hover:bg-muted poppins-regular px-4"
      >
        <Icons.duplicate className="h-4 w-4 mr-2" />
        Duplicate slide
      </button>
      <button
        onClick={() => {
          deleteSlide(slide.id);
          setOpen(false);
        }}
        className="flex items-center w-full p-2 hover:bg-muted poppins-regular px-4"
      >
        <Icons.trash className="h-4 w-4 mr-2" />
        Delete slide
      </button>
    </div>
  );
};
