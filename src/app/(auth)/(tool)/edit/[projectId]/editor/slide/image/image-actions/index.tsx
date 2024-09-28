import React, {useEffect} from "react";
import Delete from "./delete";
import Move from "./move";
import Rotate from "./rotate";
import {useImage} from "@/context/image-context";
import {ActionMenu} from "../../action-menu";
const ImageActions = () => {
  const {
    rotation,
    activeDrag,
    isSelected,
    activeTransform,
    isRotating,
    position,
    imageState,
  } = useImage()!;

  const height =
    document.getElementById(`ui-image-${imageState.imageId}`)?.clientHeight ||
    0;

  const placeAtBottom = position.y + height + 60 < 562.5;

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

export default ImageActions;
