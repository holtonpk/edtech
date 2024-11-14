"use client";
import {Icons} from "@/components/icons";
import React, {useEffect} from "react";
import useDrivePicker from "react-google-drive-picker";

export default function GoogleDriveImport() {
  const [openPicker, authResponse] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "531390591850-2bjcst5pfeqfpfl6k7j22js4465r4lfq.apps.googleusercontent.com",
      developerKey: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY as string,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log("Selectede drive Data:", data);
      },
    });
  };
  return (
    <button
      onClick={handleOpenPicker}
      className="w-full p-2 px-4 rounded-[12px] border-2 hover:border-primary items-center flex flex-col gap-2 "
    >
      <div className="flex  items-center gap-2">
        <Icons.googleDrive className="w-4 h-4" />
        <p className="text-muted-foreground text-[12px] poppins-regular">
          Import from{" "}
          <span className="poppins-bold font-bold">Google Drive</span>
        </p>
      </div>
    </button>
  );
}