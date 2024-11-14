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

export const SaveToGoogleSlides = () => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = React.useState(false);
  const [driveUrl, setDriveUrl] = React.useState("");
  const [showDriveSuccess, setShowDriveSuccess] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);

  const {
    saveFileToGoogleDrive,
    logInWithGoogle,
    checkUserAccessScopes,
    currentUser,
    setShowLoginModal,
  } = useAuth()!;
  const {slideData, title} = usePresentation()!;

  const savePPTXToDrive = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      if (!slideData) return;
      setRequestingAccess(true);
      setStillNeedsPermission(false);
      const hasScope = await checkUserAccessScopes(
        "https://www.googleapis.com/auth/drive.file"
      );
      if (!hasScope) {
        updateTokenPermissions();
      } else {
        setRequestingAccess(false);
        setIsSavingToDrive(true);
        // 1. Create the PPTX file
        const pres = await createPPTX(slideData);
        if (!pres) {
          setIsSavingToDrive(false);
          return;
        }

        // 2. Convert the PPTX to a Blob to prepare for upload
        const pptxBlob = await pres.write({outputType: "blob"});
        const res = await saveFileToGoogleDrive(
          pptxBlob as Blob,
          `${title}.pptx`
        );
        if (res?.success) {
          console.log(res.data);
          setDriveUrl(`https://docs.google.com/presentation/d/${res.data.id}`);
          setShowDriveSuccess(true);
        }

        // Remove loading state once the process is complete
        setIsDownloading(false);
        setOpenMenu(false);
      }
    }
  };
  const [isConnecting, setIsConnecting] = React.useState(false);

  const updateTokenPermissions = async () => {
    setIsConnecting(true);
    await logInWithGoogle();
    setIsConnecting(false);
    const hasScope = await checkUserAccessScopes(
      "https://www.googleapis.com/auth/drive.file"
    );
    if (hasScope) {
      setStillNeedsPermission(false);
      savePPTXToDrive();
    } else {
      setStillNeedsPermission(true);
    }
  };

  const [stillNeedsPermission, setStillNeedsPermission] = React.useState(false);

  const openInDrive = () => {
    window.open(driveUrl, "_ blank");
  };

  return (
    <>
      <button
        onClick={savePPTXToDrive}
        className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
      >
        <Icons.GoogleSlides className="w-6 h-6" />
        Google Slides
        {requestingAccess ? (
          <Icons.spinner className="w-6 h-6 animate-spin mr-2 text-primary" />
        ) : (
          <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
      <Dialog open={isSavingToDrive} onOpenChange={setIsSavingToDrive}>
        {!driveUrl ? (
          <DialogContent className="">
            <div className="grid gap-1">
              <DialogTitle className="poppins-bold text-2xl text-center">
                Importing to Google Slides
              </DialogTitle>
              <DialogDescription className="text-center">
                this will only take a few seconds
              </DialogDescription>
            </div>
            {/* <DialogHeader>
            </DialogHeader> */}

            <div className="flex w-fit mx-auto items-center gap-4">
              <Icons.logo className="w-[70px] h-[70px]" />
              <div className="flex gap-2">
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0.1}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0.2}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
              </div>
              <Icons.GoogleSlides className="w-20 h-20 " />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="">
            <div className="grid gap-1">
              <Icons.GoogleSlides className="w-20 h-20 mx-auto" />
              <DialogTitle className="poppins-bold text-2xl text-center">
                Successfully imported to Google Slides!
              </DialogTitle>
              <DialogDescription className="text-center">
                Now you can edit your presentation in Google Slides
              </DialogDescription>
            </div>
            {/* <DialogHeader>
  </DialogHeader> */}

            {driveUrl && (
              <Button
                onClick={openInDrive}
                className="flex items-center justify-center w-full border rounded-md p-2 hover:border-primary"
              >
                Click here to Open
              </Button>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
