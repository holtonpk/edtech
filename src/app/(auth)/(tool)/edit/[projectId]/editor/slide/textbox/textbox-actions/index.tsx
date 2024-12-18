import React from "react";
import Delete from "./delete";
import Move from "./move";
import Rotate from "./rotate";
import {Icons} from "@/components/icons";
import {useTextBox} from "@/context/textbox-context";
import ActionButton from "./action-button";
import {ActionMenu} from "../../action-menu";
import AiRewriteButton from "./ai-rewrite";
import Options from "./options";

const TextboxActions = () => {
  const {
    rotation,
    activeDrag,
    isSelected,
    activeTransform,
    isRotating,
    position,
    textBox,
  } = useTextBox()!;

  const height =
    document.getElementById(`ui-text-box-${textBox.textBoxId}`)?.clientHeight ||
    0;
  const placeAtBottom = position.y + height + 60 < 562.5;

  return (
    <>
      {isSelected && !activeDrag && !isRotating && !activeTransform && (
        <ActionMenu placeAtBottom={placeAtBottom} rotation={rotation}>
          <Delete />
          <Rotate />
          <Move />
          <Options />
          {/* <AiRewriteButton /> */}
        </ActionMenu>
      )}
    </>
  );
};

export default TextboxActions;
