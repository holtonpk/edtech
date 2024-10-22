import React from "react";
import {CreatePresentationForm} from "./components/create-presentation";
import {PresentationProvider} from "@/context/presentation-create-context";
import CreateSteps from "./create-steps";
import Background from "./components/background";
import ToolBar from "../edit/[projectId]/toolbar/toolbar";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import Upload from "./components/steps/upload";
import {Icons} from "@/components/icons";

const CreatePage = () => {
  return (
    <PresentationProvider>
      <NavBar />
      <CreateSteps />
      {/* <Upload /> */}
      <Background />
      {/* <CreatePresentationForm /> */}
    </PresentationProvider>
  );
};

export default CreatePage;

const NavBar = () => {
  return (
    <div className="h-[60px] w-full   flex items-center justify-between px-10 relative z-50">
      <div className="flex gap-2 items-center">
        <div className="bg-primary/20 rounded-[6px] p-1 aspect-square h-fit w-fit flex items-center justify-center">
          <Icons.wand className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-bold flex items-center gap-[2px] text-xl poppins-bold">
          Frizzle
          <span className="text-primary">ai</span>
        </h1>
      </div>
      <ProfileNav />
    </div>
  );
};
