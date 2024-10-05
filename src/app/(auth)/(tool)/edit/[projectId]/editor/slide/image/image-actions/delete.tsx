import React from "react";
import {Icons} from "@/components/icons";
import {useImage} from "@/context/image-context";
import ActionButton from "./action-button";
const Delete = () => {
  const {deleteImage} = useImage()!;

  return (
    <ActionButton
      className="nodrag hover:bg-theme-red/30  p-2 text-theme-red "
      onClick={deleteImage}
    >
      <Icons.trash className="h-4 w-4" />
    </ActionButton>
  );
};

export default Delete;
