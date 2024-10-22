import React from "react";
import Textbox from "./textbox";
const TestCanvas = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center ">
      <div
        id="slide-container"
        className="w-[1000px] aspect-video bg-background border rounded-md relative overflow-hidden"
      >
        <Textbox />
      </div>
    </div>
  );
};

export default TestCanvas;
