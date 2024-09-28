import React from "react";
import {Icons} from "@/components/icons";
import {useTextBox} from "@/context/textbox-context";
import ActionButton from "./action-button";
const Delete = () => {
  const {deleteTextBox} = useTextBox()!;
  return (
    <ActionButton
      onClick={deleteTextBox}
      className="nodrag bg-theme-red/30  p-2"
    >
      <Icons.trash className="h-4 w-4 text-theme-red" />
    </ActionButton>
  );
};

export default Delete;
