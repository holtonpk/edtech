"use client";
import React, {useState, forwardRef, HTMLAttributes} from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  useDndContext,
  MeasuringStrategy,
  DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  MeasuringConfiguration,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import {CSS, isKeyboardEvent} from "@dnd-kit/utilities";
import classNames from "classnames";

import styles from "./Pages.module.css";
import pageStyles from "./Page.module.css";

import {Slide, TextBoxType} from "@/config/data";
import {usePresentation} from "@/context/presentation-context";

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export enum Position {
  Before = -1,
  After = 1,
}

export enum Layout {
  Horizontal = "horizontal",
  Vertical = "vertical",
  Grid = "grid",
}

interface Props {
  layout: Layout;
}

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export interface PagePropsWorking
  extends Omit<HTMLAttributes<HTMLButtonElement>, "id"> {
  active?: boolean;
  clone?: boolean;
  insertPosition?: Position;
  id: UniqueIdentifier;
  index?: number;
  layout: Layout;
  onRemove?(): void;
}

export interface PageProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "id"> {
  active?: boolean;
  clone?: boolean;
  insertPosition?: Position;
  id: UniqueIdentifier;
  index?: number;
  layout: Layout;
  onRemove?(): void;
  slide: Slide | undefined;
}

const dropAnimation: DropAnimation = {
  keyframes({transform}) {
    return [
      {transform: CSS.Transform.toString(transform.initial)},
      {
        transform: CSS.Transform.toString({
          scaleX: 0.98,
          scaleY: 0.98,
          x: transform.final.x - 10,
          y: transform.final.y - 10,
        }),
      },
    ];
  },
  sideEffects: defaultDropAnimationSideEffects({
    className: {
      active: pageStyles.active,
    },
  }),
};

export function Pages({layout}: Props) {
  const {slideData} = usePresentation()!;

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState(() =>
    createRange<UniqueIdentifier>(20, (index) => `${index + 1}`)
  );
  const activeIndex =
    slideData && slideData.slides.findIndex((slide) => slide.id === activeId);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
  );

  console.log("items", items);

  return (
    <>
      {slideData && (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={measuring}
        >
          <SortableContext items={slideData.slides}>
            <ul className={classNames(styles.Pages, styles[layout])}>
              {slideData.slides.map((slide, index) => (
                <SortablePage
                  id={slide.id}
                  slide={slide}
                  index={index + 1}
                  key={slide.id}
                  layout={layout}
                  activeIndex={activeIndex}
                  onRemove={() =>
                    setItems((items) =>
                      items.filter((itemId) => itemId !== slide.id)
                    )
                  }
                />
              ))}
            </ul>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              <PageOverlay
                id={activeId}
                layout={layout}
                items={items}
                slide={slideData.slides[activeIndex]}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </>
  );

  function handleDragStart({active}: DragStartEvent) {
    setActiveId(active.id);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd({over}: DragEndEvent) {
    if (over) {
      const overIndex = items.indexOf(over.id);

      if (activeIndex !== overIndex) {
        const newIndex = overIndex;

        setItems((items) => arrayMove(items, activeIndex, newIndex));
      }
    }

    setActiveId(null);
  }
}

function PageOverlay({
  id,
  items,
  slide,
  ...props
}: Omit<PageProps, "index"> & {items: UniqueIdentifier[]}) {
  const {activatorEvent, over} = useDndContext();
  const isKeyboardSorting = isKeyboardEvent(activatorEvent);
  const activeIndex = items.indexOf(id);
  const overIndex = over?.id ? items.indexOf(over?.id) : -1;

  console.log("slide*****8", slide);

  return (
    <Page
      slide={slide}
      id={id}
      {...props}
      clone
      insertPosition={
        isKeyboardSorting && overIndex !== activeIndex
          ? overIndex > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
    />
  );
}

function SortablePage({
  id,
  activeIndex,
  ...props
}: PageProps & {activeIndex: number}) {
  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: always,
  });

  return (
    <Page
      ref={setNodeRef}
      id={id}
      active={isDragging}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
      }}
      insertPosition={
        over?.id === id
          ? index > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
      {...props}
      {...attributes}
      {...listeners}
    />
  );
}

function always() {
  return true;
}

export const Page = forwardRef<HTMLLIElement, PageProps>(function Page(
  {
    id,
    index,
    active,
    clone,
    insertPosition,
    layout,
    onRemove,
    style,
    slide,
    ...props
  },
  ref
) {
  const {selectedSlide, setSelectedSlide} = usePresentation()!;

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

  console.log("slide", slide);

  return (
    <li
      className={classNames(
        styles.Wrapper,
        active && styles.active,
        clone && styles.clone,
        insertPosition === Position.Before && styles.insertBefore,
        insertPosition === Position.After && styles.insertAfter,
        layout === Layout.Vertical && styles.vertical
      )}
      style={style}
      ref={ref}
    >
      {slide && (
        <button
          data-id={id.toString()}
          {...props}
          // id={slide.id}
          className="h-full w-full relative "
        >
          <div
            // onClick={() => {
            //   setSelectedSlide(slide);
            //   // setActiveEdit(undefined);
            // }}
            ref={selectorContainerRef}
            style={{
              background: slide.background,
            }}
            className={`rounded-lg w-full relative aspect-[16/9]  p-6 flex items-center justify-center bg-white text-black  transition-colors duration-300 cursor-pointer border-4


`}
          >
            {selectorScale ? (
              <div
                className="w-[1000px]   aspect-[16/9] absolute "
                style={{transform: `scale(${selectorScale})`}}
              >
                {slide.textBoxes.map((textbox: TextBoxType, index: number) => (
                  <div
                    key={index}
                    className="  h-[200px]  p-2 z-20 absolute  origin-center pointer-events-none"
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
                ))}
              </div>
            ) : (
              <>no scale</>
            )}
          </div>
        </button>
      )}
      {/* <button className={"b-b h-20 w-40"} data-id={id.toString()} {...props} /> */}
      {/* {!active && onRemove ? (
        <button className={styles.Remove} onClick={onRemove}>
          xx
        </button>
      ) : null} */}
      {/* {index != null ? (
        <span className={styles.PageNumber}>{index}</span>
      ) : null} */}
    </li>
  );
});
