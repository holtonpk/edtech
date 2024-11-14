import React from "react";
import {Icons} from "@/components/icons";
import {UserPresentations} from "./user-presentations";
import {NavBar} from "../navbar";
import {User} from "firebase/auth";
import {FullSlideData, UploadTypeServer} from "@/config/data";

const Presentations = () => {
  return (
    <>
      <div className="w-full flex gap-8 justify-between ">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.presIcon className="w-4 h-4 " />
          <h1 className=" text-xl poppins-semibold  "> Presentations</h1>
        </div>
        <NavBar />
      </div>
      <div className="flex flex-col gap-8 w-full  relative z-30">
        <UserPresentations />
      </div>
    </>
  );
};
export default Presentations;
