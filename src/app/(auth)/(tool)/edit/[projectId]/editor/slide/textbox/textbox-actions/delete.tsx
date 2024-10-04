import React from "react";
import {Icons} from "@/components/icons";
import {useTextBox} from "@/context/textbox-context";
import ActionButton from "./action-button";
const Delete = () => {
  const {deleteTextBox} = useTextBox()!;
  return (
    <ActionButton
      onClick={deleteTextBox}
      className="nodrag hover:bg-theme-red/30  p-2 text-theme-red "
    >
      <Icons.trash className="h-4 w-4 " />
    </ActionButton>
  );
};

export default Delete;
