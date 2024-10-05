import {useCallback, useRef} from "react";
import {useImage} from "@/context/image-context";
import {Icons} from "@/components/icons";
import ActionButton from "./action-button";
const Rotate = () => {
  const {
    rotation,
    setRotation,
    setIsRotating,
    activeTransform,
    setActiveTransform,
  } = useImage()!;
  const rotateControlRef = useRef<HTMLButtonElement>(null);
  const rotateOrigin = useRef(0);
  const isMouseDownRef = useRef(false); // Track if mouse is down

  const handleRotate = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      setRotation(rotation + ((e.clientX - rotateOrigin.current) % 360));
    },
    [setRotation, rotation]
  );

  // const handleMouseUpRotate = useCallback(() => {
  //   setIsRotating(false);
  //   isMouseDownRef.current = false;
  //   window.removeEventListener("mousemove", handleRotate);
  //   window.removeEventListener("mouseup", handleMouseUpRotate);
  //   document.body.style.cursor = "auto";
  //   window.onselectstart = () => true;
  // }, [handleRotate]);
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
      className="hover:bg-theme-blue/30 nodrag p-2 text-theme-blue"
    >
      <Icons.rotate className="h-4 w-4 " />
    </ActionButton>
  );
};

export default Rotate;
