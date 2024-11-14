"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, SlideData, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent} from "@/components/ui/popover";
import {useAuth} from "@/context/user-auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import PptxGenJS from "pptxgenjs";
import {usePresentation} from "@/context/presentation-context-basic";
import {createPPTX} from "../create-pptx";
export const Download = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const {slideData, title} = usePresentation()!;
  const {setShowLoginModal, currentUser} = useAuth()!;

  const download = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      if (!slideData) return;
      // 4. Save the Presentation
      setIsDownloading(true);
      const pres = await createPPTX(slideData);
      if (!pres) return;
      pres.writeFile({fileName: `${title}.pptx`}).then((fileName) => {
        console.log(`created file: ${fileName}`);
        setShowDownloadSuccess(true);
      });
      setIsDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={download}
        className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
      >
        <Icons.download className="w-6 h-6 text-primary" />
        Download
        {isDownloading ? (
          <Icons.spinner className="w-6 h-6 animate-spin mr-2 text-primary" />
        ) : (
          <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
      <Dialog open={showDownloadSuccess} onOpenChange={setShowDownloadSuccess}>
        <DialogContent className="">
          <div className="grid gap-1">
            <div className="h-20 w-20 p-2 bg-primary/20 rounded-md text-primary mx-auto">
              <Icons.download className="w-full h-full " />
            </div>
            <DialogTitle className="poppins-bold text-2xl text-center mt-3">
              Downloaded & ready to edit!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your presentation is downloaded and ready to import to your
              favorite editor.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
