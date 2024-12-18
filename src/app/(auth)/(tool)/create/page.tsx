"use client";

import React, {useState} from "react";

import CreateSteps from "./create-steps";
import Background from "./components/background";
import ToolBar from "../edit/[projectId]/toolbar/toolbar";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import {Icons} from "@/components/icons";
import {
  PresentationCreateProvider,
  usePresentationCreate,
} from "@/context/presentation-create-context";
import AuthModal from "@/components/auth/auth-modal";
import {LinkButton} from "@/components/ui/link";

const CreatePage = () => {
  return (
    <PresentationCreateProvider startStep={1}>
      <CreatePageLayout />
    </PresentationCreateProvider>
  );
};

export default CreatePage;
const CreatePageLayout = () => {
  const {step} = usePresentationCreate()!;

  return (
    <div className="h-fit">
      <Background />
      <AuthModal />

      <div className="h-screen w-screen">
        <NavBar />
        <CreateSteps />
      </div>

      <Footer />
    </div>
  );
};

const NavBar = () => {
  return (
    <div className="h-[60px] w-full   flex items-center justify-between px-6 relative z-50">
      <LinkButton
        href="/dashboard"
        className="flex gap-2 items-center hover:bg-transparent p-0 bg-transparent"
      >
        <div className=" aspect-square h-fit w-fit flex items-center justify-center">
          <Icons.logo className="w-8 h-8 " />
        </div>
        <h1 className="font-bold flex items-center gap-[2px] text-2xl mt-2 poppins-bold text-black">
          Frizzle
          <span className="text-primary">.AI</span>
        </h1>
      </LinkButton>
      <ProfileNav />
    </div>
  );
};

const Footer = () => {
  return (
    <div className="mt-10 w-screen h-fit py-4 gap-4 bg-background/30 blurBack border-t flex justify-between items-center px-20">
      <div className="flex">
        <Icons.logo className="w-6 h-6 text-primary" />

        <h1 className="text-primary poppins-bold text-xl"> Frizzle AI</h1>
      </div>
      {/* <div className="flex w-1/2 justify-between">
        <a href="/privacy">
          <h1 className="text-black poppins-bold text-sm">Privacy</h1>
        </a>
        <a href="/terms">
          <h1 className="text-black poppins-bold text-sm">Terms</h1>
        </a>
        <a href="/contact">
          <h1 className="text-black poppins-bold text-sm">Contact</h1>
        </a>
      </div> */}
      <span className="w-fit whitespace-nowrap mt-2 text-[12px]">
        © 2024 Frizzle Ai - All rights reserved
      </span>
    </div>
  );
};
