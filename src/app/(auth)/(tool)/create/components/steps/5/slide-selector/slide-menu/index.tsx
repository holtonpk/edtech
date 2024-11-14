import React, {useState} from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
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
import {
  restrictToHorizontalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import {CSS, isKeyboardEvent} from "@dnd-kit/utilities";
import classNames from "classnames";
import {Slide} from "@/config/data";

import {MiniSlide, Layout, Position} from "./Mini-Slide";
import type {Props as PageProps} from "./Mini-Slide";
import styles from "./Slide-Menu.module.css";
import pageStyles from "./Slide.module.css";
import {usePresentation} from "@/context/presentation-context-basic";
import {useDraggable} from "@dnd-kit/core";
import type {ClientRect} from "@dnd-kit/core";
import type {Transform} from "@dnd-kit/utilities";
import type {Modifier} from "@dnd-kit/core";

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation: DropAnimation = {
  keyframes({transform}) {
    return [
      {transform: CSS.Transform.toString(transform.initial)},
      {
        transform: CSS.Transform.toString({
          scaleX: 0.98,
          scaleY: 0.98,
          x: transform.final.x - 8,
          y: transform.final.y + 8,
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

export function SlideMenu({
  container,
}: {
  container: React.RefObject<HTMLDivElement>;
}) {
  function restrictToBoundingRect(
    transform: Transform,
    rect: ClientRect,
    boundingRect: ClientRect
  ): Transform {
    const value = {
      ...transform,
    };

    if (rect.top + transform.y <= boundingRect.top) {
      value.y = boundingRect.top - rect.top;
    } else if (
      rect.bottom + transform.y >=
      boundingRect.top + boundingRect.height
    ) {
      value.y = boundingRect.top + boundingRect.height - rect.bottom;
    }

    const scrollOffset = container.current?.scrollLeft || 0;

    value.x = transform.x - boundingRect.left + 10 - scrollOffset;

    if (rect.left + transform.x <= boundingRect.left) {
      value.x = boundingRect.left - rect.left;
    } else if (
      rect.right + transform.x >=
      boundingRect.left + boundingRect.width
    ) {
      value.x = boundingRect.left + boundingRect.width - rect.right;
    }

    return value;
  }

  const restrictToParentElement: Modifier = ({
    containerNodeRect,
    draggingNodeRect,
    transform,
  }) => {
    if (!draggingNodeRect || !containerNodeRect) {
      return transform;
    }

    return restrictToBoundingRect(
      transform,
      draggingNodeRect,
      containerNodeRect
    );
  };

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
  // );
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {slideData, setSlideData} = usePresentation()!;

  const activeIndex =
    activeId && slideData
      ? slideData.slides.findIndex((slide) => slide.id === activeId)
      : -1;

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
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={slideData.slides.map((slide) => slide.id)}>
            <ul className={classNames(styles.Pages, styles["horizontal"])}>
              {slideData.slides.map((slide, index) => (
                <SortablePage
                  id={slide.id}
                  index={index + 1}
                  key={slide.id}
                  slide={slide}
                  activeIndex={activeIndex}
                />
              ))}
            </ul>
          </SortableContext>
          <DragOverlay
            dropAnimation={dropAnimation}
            // modifiers={[restrictToParentElement]}
          >
            {activeId ? (
              <PageOverlay
                id={activeId}
                slides={slideData.slides}
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
    if (over && slideData) {
      const overIndex = slideData.slides.findIndex(
        (slide) => slide.id === over.id
      );

      if (activeIndex !== overIndex) {
        const newSlides = arrayMove(slideData.slides, activeIndex, overIndex);
        setSlideData((prev) => ({...prev!, slides: newSlides}));
      }
    }

    setActiveId(null);
  }
}

function PageOverlay({
  id,
  slides,
  ...props
}: Omit<PageProps, "index"> & {slides: Slide[]}) {
  const {activatorEvent, over} = useDndContext();
  const isKeyboardSorting = isKeyboardEvent(activatorEvent);
  const activeIndex = slides.findIndex((slide) => slide.id === id);
  const overIndex = over?.id
    ? slides.findIndex((slide) => slide.id === over.id)
    : -1;

  return (
    <MiniSlide
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
    <MiniSlide
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
