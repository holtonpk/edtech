import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

const RotationDisplay = ({rotation}: {rotation: number}) => {
  const [position, setPosition] = useState({x: 0, y: 0});

  const onMouseMove = (e: MouseEvent) => {
    setPosition({x: e.clientX, y: e.clientY});
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [rotation]);

  const editPageRoot = document.getElementById("editPage-root");

  if (!editPageRoot) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        top: position.y,
        left: position.x,
        position: "fixed", // Keeps the position relative to the viewport
      }}
      className="bg-background/80 blurBack  rounded-md border shadow-sm py-2 poppins-bold text-primary fixed w-[55px] flex items-center justify-center z-[999]"
    >
      {rotation}°
    </div>,
    editPageRoot // Mounting the component to the document body
  );
};

export default RotationDisplay;
