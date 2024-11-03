"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast";
import usePresentation from "@/context/presentation-create-context";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
// import GoogleDriveImport from "@/src/app/(auth)/(tool)/create2/components/steps/upload/google-drive-import";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import {LucideProps} from "lucide-react";
import {
  FILE_SIZE,
  FileLocal,
  MAX_FILE_SIZE_MB,
  UploadType,
} from "@/config/data";

import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

const Uploads = () => {
  const dummyFiles = [
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "asdfa",
      title: "1test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "1",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "adfadsf",
      title: "2test.pdf",
      type: "jpg" as FileLocal["type"],
      id: "2",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "fadasd",
      title: "3test.pdf",
      type: "mp4" as FileLocal["type"],
      id: "3",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "hgdfgfhd",
      title: "4test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "4",
    },
    {
      file: new File([""], "test.pdf", {type: "application/pdf"}),
      uploadProgress: 100,
      path: "wrwreetw",
      title: "5test.pdf",
      type: "pdf" as FileLocal["type"],
      id: "5",
    },
  ];

  const [files, setFiles] = useState<FileLocal[] | undefined>(dummyFiles);

  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col  gap-1  pb-0 relative">
        <h1 className=" text-2xl poppins-bold ">Your Uploads</h1>
        {/* <p className="poppins-regular">Turn these files into presentations</p> */}
      </div>

      <motion.div
        className={`flex flex-col  w-full relative bgs-background rounded-lg  mt-2  h-full   overflow-hidden
     
    `}
        animate={{opacity: 1}}
        initial={{opacity: 0}}
        transition={{duration: 0.2}}
      >
        {/* {isScrolled && (
        <div className="absolute left-0 bottom-0 translate-y-full w-full  z-30  fade-in-0 duration-500">
          <div className="upload-manager-grad-top w-full h-16 z-30 pointer-events-none"></div>
        </div>
      )} */}
        <div
          id="upload-manager"
          className="gap-2  grid  h-fit max-h-full  z-20 relative overflow-scroll flex-animate"
        >
          <AnimatePresence>
            {files &&
              files.map((file, index) => (
                <FileRow
                  key={index}
                  index={index}
                  fileLocal={file}
                  setFiles={setFiles}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* <div className="absolute  left-0 bottom-0  w-full pointer-events-none z-30 animate-in fade-in-0 duration-500">
          <div className="upload-manager-grad-bottom w-full h-12 z-30 pointer-events-none"></div>
        </div> */}
      </motion.div>
      {/* <motion.div
        animate={{opacity: 1}}
        initial={{opacity: 0}}
        transition={{duration: 0.5, delay: 0.5}}
        className="w-full flex"
      >
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button
              className="w-fit   bg-background border-ts z-40 rounded-md mx-auto shadow-lg"
              variant={"ghost"}
            >
              <Icons.add className="w-5 h-5  mr-1" />
              Add file
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-none p-0 border-none">
            <FileUpload files={files} setFiles={setFiles} />
          </DialogContent>
        </Dialog>
      </motion.div> */}
    </div>
  );
};

export default Uploads;

const FileRow = ({
  fileLocal,
  index,
  setFiles,
}: {
  index: number;
  fileLocal: FileLocal;
  setFiles: React.Dispatch<React.SetStateAction<FileLocal[] | undefined>>;
}) => {
  const uploadComplete = fileLocal.uploadProgress === 100;

  console.log("File Progress: ", fileLocal.uploadProgress);

  const renderIcon = () => {
    switch (fileLocal.type) {
      case "pdf":
      case "doc":
      case "docx":
        return <Icons.pdf className=" w-5 h-5 text-primary " />;

      case "mp4":
        return <Icons.vid className=" w-5 h-5 text-primary " />;

      case "jpg":
      case "jpeg":
      case "png":
        return <Icons.img className=" w-5 h-5 text-primary " />;

      case "mp3":
        return <Icons.audio className=" w-5 h-5 text-primary " />;

      default:
        return <Icons.file className=" w-5 h-5 text-primary " />;
    }
  };

  return (
    <motion.div
      // exit={{
      //   opacity: 0,
      //   transform: "translateX(-800px)",
      //   transitionEnd: {
      //     height: 0, // This will happen after opacity and transform transition
      //   },
      // }}
      initial={{opacity: 1, transform: "translateY(500px)"}}
      animate={{opacity: 1, transform: "translateY(0px)"}}
      transition={{duration: 0.5, delay: 0.2 * index}}
      className="w-full p-2 px-4 flex flex-col gap-2 border shadow-md bg-background rounded-lg "
    >
      <div className="grid grid-cols-[1fr_24px] items-center gap-4">
        <div className="flex flex-col">
          <div className="flex flex-row gap-4 items-center">
            <span className="p-2 rounded-sm border aspect-square h-fit flex items-center justify-center">
              {renderIcon()}
            </span>
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{fileLocal.title}</span>
                </div>
              </div>
              <div className="flex  relative w-full h-6">
                {uploadComplete && fileLocal.file && (
                  <div className="text-muted-foreground ">
                    {(fileLocal.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}

                {!uploadComplete && (
                  <div className=" flex flex-col items-end  absolute left-0 bottom-0 w-full">
                    <span className="text-primary font-bold  w-[50px]">{`${Math.ceil(
                      fileLocal.uploadProgress
                    ).toFixed(0)}%`}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{width: `${fileLocal.uploadProgress}%`}}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {}}
          className="bg-gray-300 hover:bg-gray-500 transition-colors duration-500 rounded-full aspect-square h-fit p-1"
        >
          <Icons.close className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};
