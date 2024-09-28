import React from "react";
import {Icons} from "@/components/icons";
import ActionButton from "./action-button";

const Move = () => {
  return (
    <ActionButton className=" bg-theme-green/30 p-2">
      <Icons.move className="h-4 w-4 text-theme-green" />
    </ActionButton>
  );
};

export default Move;
