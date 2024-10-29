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
      className={`flex h-full  w-full gap-2 absolute top-0  z-30 origin-center pointer-events-none 
             ${
               placeAtBottom
                 ? "-bottom-2 translate-y-full "
                 : " -top-2 -translate-y-full "
             }
            `}
    >
      <div
        className={`flex  left-1/2 pointer-events-auto  absolute -translate-x-1/2 h-fit w-fit bg-background/80 blurBack border  shadow-lg  p-1 rounded-md items-center 
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
