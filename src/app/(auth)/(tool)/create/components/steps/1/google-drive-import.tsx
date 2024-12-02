"use client";
import {Icons} from "@/components/icons";
import React, {useEffect} from "react";
import useDrivePicker from "react-google-drive-picker";
import {usePresentationCreate} from "@/context/presentation-create-context";
import {useAuth} from "@/context/user-auth";
import {GoogleDriveFile} from "@/config/data";

export default function GoogleDriveImport() {
  const [openPicker, authResponse] = useDrivePicker();
  const {setInputFiles} = usePresentationCreate()!;
  const {currentUser, getGoogleAccessToken, googleDriveTokenRef} = useAuth()!;

  const [isLoading, setIsLoading] = React.useState(false);
  const handleOpenPicker = async () => {
    setIsLoading(true);

    const processPicker = async (token: string) => {
      if (!token) {
        console.log("No token ======================");
        return;
      }
      const files = await OpenPicker(token);
      await getFiles(files, token);
    };

    const token = googleDriveTokenRef.current
      ? googleDriveTokenRef.current
      : await getGoogleAccessToken(
          "https://www.googleapis.com/auth/drive.file",
          () => setIsLoading(false)
        );

    if (googleDriveTokenRef.current) {
      const hasAccess = await checkUserAccessScopes(
        googleDriveTokenRef.current
      );
      if (hasAccess) {
        return await processPicker(googleDriveTokenRef.current);
      }
    }

    await processPicker(token);
  };

  const OpenPicker = async (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      openPicker({
        clientId:
          "531390591850-2bjcst5pfeqfpfl6k7j22js4465r4lfq.apps.googleusercontent.com",
        developerKey: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY as string,
        viewId: "DOCS",
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        token: token,
        callbackFunction: (data) => {
          if (data.action === "cancel") {
            console.log("User clicked cancel/close button");
            setIsLoading(false);

            reject();
          } else if (data.action === "picked") {
            console.log("User selected files", data);
            const files = data.docs.map((file) => {
              return {
                id: file.id,
                name: file.name,
                mimeType: file.mimeType,
              };
            });

            resolve(files); // Resolve only on 'picked' action
          } else {
            console.log(`Unhandled action: ${data.action}`);
          }
        },
      });
    });
  };

  // Usage

  const getFiles = async (driveFiles: GoogleDriveFile[], token: string) => {
    setIsLoading(true);
    const res = await fetch("/api/get-file-from-drive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({token: token, files: driveFiles}),
    });

    const data = await res.json();
    const {files} = data;

    if (files) {
      let updatedInputFiles: any = [];
      files.forEach((file: any) => {
        const fileFull = convertBase64ToFile(file.file, file.name);
        updatedInputFiles.push(fileFull);
      });
      setInputFiles(updatedInputFiles);
    }
  };

  return (
    <button
      onClick={handleOpenPicker}
      className="w-full p-2 px-4 rounded-[12px] border-2 hover:border-primary items-center flex flex-col gap-2 relative z-20"
    >
      <div className="flex  items-center gap-2">
        {isLoading ? (
          <Icons.spinner className="w-4 h-4 animate-spin  text-primary" />
        ) : (
          <Icons.googleDrive className="w-4 h-4" />
        )}

        <p className="text-muted-foreground text-[12px] poppins-regular">
          Import from{" "}
          <span className="poppins-bold font-bold">Google Drive</span>
        </p>
      </div>
    </button>
  );
}

const checkUserAccessScopes = async (authToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Error checking user access scopes:", response);
    return false;
  }
  const data = await response.json();
  const scopes = data.scope.split(" ");
  if (scopes.includes("https://www.googleapis.com/auth/drive")) {
    return true;
  } else {
    return false;
  }
};

const convertBase64ToFile = (base64: string, filename: string) => {
  // Check if the base64 string contains the expected 'data:' prefix
  const base64Prefix = "data:";
  if (!base64.startsWith(base64Prefix)) {
    throw new Error("Invalid base64 string format.");
  }

  const arr = base64.split(",");

  // Check if the base64 string is correctly split into mime type and content
  if (arr.length !== 2) {
    throw new Error("Base64 string is not correctly formatted.");
  }

  const mime = arr[0].match(/:(.*?);/)?.[1];
  if (!mime) {
    throw new Error("MIME type could not be extracted from base64 string.");
  }

  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type: mime});
};
