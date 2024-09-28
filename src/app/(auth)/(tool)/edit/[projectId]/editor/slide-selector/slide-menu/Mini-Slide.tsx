import React, {forwardRef, HTMLAttributes} from "react";
import type {UniqueIdentifier} from "@dnd-kit/core";
import classNames from "classnames";
import {Slide, TextBoxType} from "@/config/data";
import {usePresentation} from "@/context/presentation-context";
import {removeIcon} from "./icons";
import styles from "./Slide.module.css";

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

  return (
    <li
      className={classNames(
        styles.Wrapper,
        active && styles.active,
        clone && styles.clone,
        insertPosition === Position.Before && styles.insertBefore,
        insertPosition === Position.After && styles.insertAfter,
        styles.horizontal,
        "h-full"
      )}
      style={style}
      ref={ref}
    >
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
              setActiveEdit(undefined);
              setActiveGroupSelectedTextBoxes(undefined);
              setGroupSelectedTextBoxes(undefined);
            }}
            ref={selectorContainerRef}
            style={{
              background: slide.background,
            }}
            className={`rounded-lg h-[80px]    relative aspect-[16/9] p-6 flex items-center justify-center bg-white text-black  transition-colors duration-300 cursor-pointer border-4
${selectedSlide?.id === slide.id ? "border-primary" : "border-border"}

`}
          >
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
