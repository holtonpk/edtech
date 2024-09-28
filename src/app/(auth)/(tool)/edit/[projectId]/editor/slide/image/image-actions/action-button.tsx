import React from "react";
import {cn} from "@/lib/utils";

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
        "rounded-full text-white border p-2 shadow-md hover:opacity-80 transition-colors duration-200  h-fit flex items-center gap-2"
      )}
    >
      {children}
    </button>
  );
};

export default ActionButton;
