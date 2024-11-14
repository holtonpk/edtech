"use client";
import React, {useState} from "react";
import {Icons} from "@/components/icons";
import {NavBar} from "../navbar";
import UserUploads from "./user-uploads";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import useDrivePicker from "react-google-drive-picker";

const Uploads = () => {
  return (
    <>
      <div className="w-full flex gap-8 justify-between ">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.uploadIcon className="w-4 h-4 " />
          <h1 className=" text-xl poppins-semibold  "> Uploads</h1>
        </div>
        <NavBar />
      </div>
      <div className="flex flex-col gap-8 w-full  relative z-30">
        <UserUploads />
      </div>
    </>
  );
};

export default Uploads;

const UploadFile = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogTrigger asChild>
        <Button className="w-fit ml-auto   border-ts z-40 rounded-md shadow-lg">
          <Icons.add className="w-5 h-5  mr-1" />
          Upload a file
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-none p-0 border-none">
        <FileUploadStart
          isDragging={isDragging}
          setOpen={setShowUploadDialog}
        />
      </DialogContent>
    </Dialog>
  );
};

const FileUploadStart = ({
  setOpen,
  isDragging,
}: {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDragging: boolean;
}) => {
  // const {inputFiles, setInputFiles} = usePresentationCreate()!;

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    // setInputFiles(fileList);

    setOpen && setOpen(false);
  };

  return (
    <div
      className={`overflow-hidden h-fit border rounded-md p-8 bg-background/70 blurBack shadow-xl
          ${
            isDragging
              ? " border-primary border-dashed  "
              : " border-border border-solid"
          }
        `}
    >
      <div
        className={` h-fit  w-full    items-center flex flex-col gap-2 mb-2 group
            
          `}
      >
        <input
          id="file-input"
          style={{display: "none"}}
          type="file"
          accept=".pdf, .jpg, .png, .mp4, .doc, .mp3, docx"
          onChange={(e) => {
            onFileChange(e);
          }}
          multiple
        />

        <button
          onClick={() => {
            document.getElementById("file-input")?.click();
            // setStep(1);
          }}
          className="w-full  items-center flex flex-col gap-2 group"
        >
          <Icons.files className="w-[150px] text-primary" />
          {/* <div className="h-[80px]"></div> */}
          <span className="text-2xl font-bold">
            Drag & drop files to upload
          </span>
          <p className="text-muted-foreground">
            Supported formats: .pdf .docs .mp4 .mp3 .png .jpg
          </p>
          <div className="grid grid-cols-2 gap-4 items-center mt-2">
            <div className="w-full p-2 px-4 h-fit rounded-[12px] border bg-primary text-white text-[12px] poppins-regular hover:bg-primary/90  ">
              Select files
            </div>
            <GoogleDriveImport />
          </div>
        </button>
      </div>
      <div className="flex items-center text-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-600 font-bold">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <YoutubeInput setOpen={setOpen} />
    </div>
  );
};

const YoutubeInput = ({
  setOpen,
}: {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);

  // const {setFiles, filesRef, files, addNewUploadsText, scrapeYoutube} =
  //   usePresentationCreate()!;

  // const {currentUser} = useAuth()!;

  const handleSubmit = async () => {
    if (!url) return;
    setIsLoading(true);

    // const newFile = await scrapeYoutube(url);
    // setFiles([...(files || []), newFile]);
    // filesRef.current = [...(files || []), newFile];
    // setStep(1);
    // addNewUploadsText(newFile.text);
    setIsLoading(false);
    setOpen && setOpen(false);
  };

  return (
    <>
      {error && (
        <div className=" text-theme-red poppins-regular text-sm mb-2">
          Invalid link must be a youtube link
        </div>
      )}
      <div className="w-full border rounded-md flex relative gap-1 p-2 items-center px-4 mb-4">
        <Icons.Youtube className="w-8 h-8 text-primary " />
        <input
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          type="text"
          placeholder="Paste a youtube link here..."
          className="w-full px-4 rounded-md border-none bg-transparent noFocus"
        />
        {url && (
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary rounded-full flex items-center justify-center p-1"
          >
            {isLoading ? (
              <Icons.spinner className="text-white h-4 w-4 animate-spin" />
            ) : (
              <Icons.chevronRight className="text-white h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </>
  );
};

export function GoogleDriveImport() {
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
