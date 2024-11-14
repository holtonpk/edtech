"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {createPPTX} from "../page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {usePresentation} from "@/context/presentation-context-basic";
import {useAuth} from "@/context/user-auth";

export const SaveToPowerPoint = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const {slideData, title} = usePresentation()!;
  const {currentUser, setShowLoginModal} = useAuth()!;

  const SaveToPowerPoint = async () => {
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
        onClick={SaveToPowerPoint}
        className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
      >
        <Icons.PowerPoint className="w-6 h-6 " />
        Power Point
        {isDownloading ? (
          <Icons.spinner className="w-6 h-6 animate-spin mr-2 text-primary" />
        ) : (
          <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
      <Dialog open={showDownloadSuccess} onOpenChange={setShowDownloadSuccess}>
        <DialogContent className="">
          <div className="grid gap-1">
            <Icons.PowerPoint className="w-20 h-20 mx-auto" />
            <DialogTitle className="poppins-bold text-2xl text-center">
              Downloaded & ready to edit!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your presentation is downloaded and ready to edit in PowerPoint.
              <br />
              Click{" "}
              <a
                target="_blank"
                className="text-primary underline"
                href="https://support.microsoft.com/en-us/office/reuse-import-slides-from-another-presentation-c67671cd-386b-45dd-a1b4-1e656458bb86#:~:text=add%20slide%20after.-,On%20the%20Home%20tab%20of%20the%20ribbon%2C%20in%20the%20Slides,reuse%20it%20in%20your%20presentation."
              >
                here
              </a>{" "}
              to learn how to upload it to PowerPoint
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
