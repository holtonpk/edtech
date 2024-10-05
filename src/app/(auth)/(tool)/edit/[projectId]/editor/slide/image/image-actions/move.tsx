import React from "react";
import {Icons} from "@/components/icons";
import ActionButton from "./action-button";
const Move = () => {
  return (
    <ActionButton className=" hover:bg-theme-green/30 text-theme-green p-2">
      <Icons.move className="h-4 w-4" />
    </ActionButton>
  );
};

export default Move;
