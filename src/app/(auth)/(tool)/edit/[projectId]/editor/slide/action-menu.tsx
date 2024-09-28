import React from "react";

export const ActionMenu = ({
  children,
  placeAtBottom,
  rotation,
}: {
  placeAtBottom: boolean;
  children: React.ReactNode;
  rotation: number;
}) => {
  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`flex h-full  w-full gap-2 absolute top-0  z-30 origin-center pointer-events-auto 
             ${
               placeAtBottom
                 ? "-bottom-2 translate-y-full animate-in zoom-in-95 slide-in-from-top-2 duration-[.2]"
                 : " -top-2 -translate-y-full animate-in zoom-in-95 slide-in-from-bottom-2 duration-[.2]"
             }
            `}
    >
      <div
        className={`flex gap-2 left-1/2  absolute -translate-x-1/2 h-fit w-fit bg-background/60 blurBack border  shadow-lg  p-1 rounded-full items-center 
          ${
            placeAtBottom
              ? "-bottom-2 translate-y-full"
              : " -top-2 -translate-y-full "
          }
          `}
      >
        {children}
      </div>
    </div>
  );
};
