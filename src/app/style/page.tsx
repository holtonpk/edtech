import React from "react";

const StyleView = () => {
  return (
    <div className="grid grid-cols-2 w-screen h-screen">
      <div className="grid grid-cols-6  bg-background w-full p-8">
        {colorVariables.map((color) => (
          <div key={color} className="flex flex-col h-fit">
            <div
              className={`h-20 w-20 rounded-full border border-black
        ${"bg-" + color}
            `}
            ></div>
            <div className="text-black">{color}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 dark bg-background w-full p-8">
        {colorVariables.map((color) => (
          <div key={color} className="flex flex-col h-fit">
            <div
              className={`h-20 w-20 rounded-full border border-white
        ${"bg-" + color}
            `}
            ></div>
            <div className="text-white">{color}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleView;

const colorVariables = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
];
