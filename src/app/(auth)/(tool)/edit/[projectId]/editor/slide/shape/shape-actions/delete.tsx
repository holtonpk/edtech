import React from "react";
import {Icons} from "@/components/icons";
import {useShape} from "@/context/shape-context";
import ActionButton from "./action-button";
const Delete = () => {
  const {deleteShape} = useShape()!;

  return (
    <ActionButton
      className="nodrag hover:bg-theme-red/30  p-2 text-theme-red "
      onClick={deleteShape}
    >
      <Icons.trash className="h-4 w-4" />
    </ActionButton>
  );
};

export default Delete;
