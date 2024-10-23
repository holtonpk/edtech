import React from "react";
import {useShape} from "@/context/shape-context";
import {ActionMenu} from "../../action-menu";
import Delete from "./delete";
import Move from "./move";
import Rotate from "./rotate";

const ShapeActions = () => {
  const {
    rotation,
    activeDrag,
    isSelected,
    activeTransform,
    isRotating,
    position,
    shapeState,
    size,
  } = useShape()!;

  const placeAtBottom = position.y + size.height + 60 < 562.5;

  return (
    <>
      {isSelected && !activeDrag && !isRotating && !activeTransform && (
        <ActionMenu placeAtBottom={placeAtBottom} rotation={rotation}>
          <Delete />
          <Rotate />
          <Move />
        </ActionMenu>
      )}
    </>
  );
};

export default ShapeActions;
