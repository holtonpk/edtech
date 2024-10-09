import React, {useCallback, useRef} from "react";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {ActionMenu} from "../../action-menu";
import {usePresentation} from "@/context/presentation-context";

const TextboxActions = ({
  position,
  size,
  activeDrag,
  activeTransform,
}: {
  position: {x: number; y: number};
  size: {width: number; height: number};
  activeDrag: boolean;
  activeTransform: boolean;
}) => {
  const placeAtBottom = position.y + size.height + 60 < 562.5;

  return (
    <>
      {!activeDrag && !activeTransform && (
        <ActionMenu placeAtBottom={placeAtBottom} rotation={0}>
          <Delete />
          {/* <Rotate /> */}
          <Move />
          {/* <AiRewriteButton /> */}
        </ActionMenu>
      )}
    </>
  );
};

export default TextboxActions;

const Move = () => {
  return (
    <ActionButton className=" hover:bg-theme-green/30 text-theme-green p-2">
      <Icons.move className="h-4 w-4 " />
    </ActionButton>
  );
};

const Delete = () => {
  const {deleteMultiTextBoxes} = usePresentation()!;

  return (
    <ActionButton
      onClick={deleteMultiTextBoxes}
      className="nodrag hover:bg-theme-red/30  p-2 text-theme-red "
    >
      <Icons.trash className="h-4 w-4 " />
    </ActionButton>
  );
};

const Rotate = ({
  rotation,
  setRotation,
  setIsRotating,
  setActiveTransform,
}: {
  rotation: number;
  setRotation: (rotation: number) => void;
  setIsRotating: (isRotating: boolean) => void;
  setActiveTransform: (activeTransform: boolean) => void;
}) => {
  const rotateControlRef = useRef<HTMLButtonElement>(null);
  const rotateOrigin = useRef(0);
  const isMouseDownRef = useRef(false); // Track if mouse is down

  const {
    activeGroupSelectedTextBoxes,
    mode,
    slideData,
    selectedSlide,
    setSlideData,
  } = usePresentation()!;

  const handleRotate = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      const newRotation = rotation + ((e.clientX - rotateOrigin.current) % 360);
      setRotation(newRotation);
    },
    [setRotation, rotation]
  );

  const onMouseUp = useCallback(() => {
    setActiveTransform(false);
  }, [setActiveTransform]);

  const handleMouseDownRotate = useCallback(
    (e: React.MouseEvent) => {
      setActiveTransform(true);
      e.preventDefault();
      isMouseDownRef.current = true;
      rotateOrigin.current = e.clientX;
      setIsRotating(true);

      // Change cursor style and disable text selection
      document.body.style.cursor = "ew-resize";
      window.onselectstart = () => false;

      window.addEventListener("mousemove", handleRotate);
      window.addEventListener(
        "mouseup",
        () => {
          isMouseDownRef.current = false;
          window.removeEventListener("mousemove", handleRotate);
          setIsRotating(false);
          onMouseUp();
          document.body.style.cursor = "auto";
          window.onselectstart = () => true;
        },
        {once: true}
      );
    },
    [handleRotate, onMouseUp, setActiveTransform, setIsRotating]
  );

  return (
    <ActionButton
      onMouseDown={handleMouseDownRotate}
      ref={rotateControlRef}
      className="bg-theme-blue/30 nodrag p-2"
    >
      <Icons.rotate className="h-4 w-4 text-theme-blue" />
    </ActionButton>
  );
};

const ActionButton = ({
  children,
  onClick,
  className,
  onMouseDown,
  ref,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  ref?: React.RefObject<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      onMouseDown={onMouseDown}
      ref={ref}
      onClick={onClick}
      className={cn(
        className,
        "rounded-full   transition-colors duration-200  h-fit flex items-center gap-2"
      )}
    >
      {children}
    </button>
  );
};
