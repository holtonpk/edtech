"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, SlideData, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {PresentationProvider} from "@/context/presentation-context-basic";
import {PresentationCard} from "./presentation-card";
import Background from "./background";
import ToolBar from "./toolbar/toolbar";
import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import PptxGenJS from "pptxgenjs";
import {SaveToCanvaFull, SaveToCanva} from "./exports/canva";
import {SaveToGoogleSlides} from "./exports/google-slides";
import {SaveToPowerPoint} from "./exports/power-point";
import {Download} from "./exports/download";
import {Themes} from "./themes";
import AuthModal from "@/components/auth/auth-modal";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import Waitlist from "./waitlist";
const Presentation = ({params}: {params: {presentationId: string}}) => {
  const {presentationId} = params;

  return (
    <div className="h-fit md:h-screen w-screen  flex flex-col overflow-hidden gap-2">
      {/* <NewProjectMessage /> */}
      <Background />
      {/* <NavBar /> */}
      <AuthModal />
      <div className="h-screen w-screen overflow-hidden">
        <PresentationProvider projectId={presentationId}>
          <ToolBar />
          <div className=" h-full grid grid-flow-col p-4 max-w-[1800px]  mx-auto rounded-md overflow-hidden  max-w-screen gap-4  ">
            <div
              id="slide-area"
              className=" gap-2 w-[calc(100vw-300px)] overflow-hidden relative "
            >
              <PresentationCard presId={presentationId} />
            </div>
            <div className="flex flex-col gap-4 w-full flex-grow ">
              <Themes />

              <div className="flex gap-4 flex-col p-4 h-fit bg-background blurBack rounded-md shadow-lg border w-full ">
                <div className="grid gap-1 ">
                  <h1 className=" poppins-bold text-xl ">Edit</h1>
                  <p>Open in your favorite app to edit further</p>
                </div>
                <div className="grid  gap-4 ">
                  <SaveToGoogleSlides />
                  <SaveToCanva />
                  <SaveToPowerPoint />
                  <Download />
                </div>
              </div>
              <Waitlist />
            </div>
          </div>
        </PresentationProvider>
      </div>
    </div>
  );
};

export default Presentation;
