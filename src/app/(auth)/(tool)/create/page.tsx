import React from "react";
import {CreatePresentationForm} from "./components/create-presentation";
import {PresentationProvider} from "@/context/presentation-create-context";
import CreateSteps from "./create-steps";
import Background from "./components/background";
import ToolBar from "../edit/[projectId]/toolbar/toolbar";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";

import {Icons} from "@/components/icons";

const CreatePage = () => {
  return (
    <PresentationProvider>
      <NavBar />
      <CreateSteps />
      <Background />
      {/* <CreatePresentationForm /> */}
    </PresentationProvider>
  );
};

export default CreatePage;

const NavBar = () => {
  return (
    <div className="h-[60px] w-full bg-[#f3f6f8] blurBack3  border-b flex items-center justify-between px-10 relative z-50">
      <div className="flex gap-1 items-center">
        <Icons.lightbulb className="w-6 h-6 text-primary" />
        <h1 className="font-bold">EDTech tool</h1>
      </div>
      <ProfileNav />
    </div>
  );
};
