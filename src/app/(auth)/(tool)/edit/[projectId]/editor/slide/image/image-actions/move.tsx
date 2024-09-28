import React from "react";
import {Icons} from "@/components/icons";
import ActionButton from "./action-button";
const Move = () => {
  return (
    <ActionButton className="bg-green-500">
      <Icons.move className="h-4 w-4" />
    </ActionButton>
  );
};

export default Move;
