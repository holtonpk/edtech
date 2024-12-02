"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast";
import {usePresentationCreate} from "@/context/presentation-create-context";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import GoogleDriveImport from "./google-drive-import";
import {useRouter} from "next/router";
import {MAX_UNSUB_GENERATIONS} from "@/config/data";

import {
  FILE_SIZE,
  FileLocal,
  MAX_FILE_SIZE_MB,
  UploadType,
} from "@/config/data";
import {useAuth} from "@/context/user-auth";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {db} from "@/config/firebase";
import {doc, getDoc, setDoc, serverTimestamp} from "firebase/firestore";

export const Step1 = () => {
  const {step, setStep, prevStep, setPrevStep} = usePresentationCreate()!;

  useEffect(() => {
    setTimeout(() => {
      setPrevStep(1);
    }, 1000);
  }, []);

  const {uploadText} = usePresentationCreate()!;

  const [showUploadText, setShowUploadText] = useState(false);

  return (
    <>
      <motion.div
        exit={
          step > 1
            ? {opacity: 0, transform: "translateX(-200px)"}
            : {opacity: 0, transform: "translateX(200px)"}
        }
        animate={{opacity: 1, transform: "translate(0px)"}}
        initial={
          prevStep === 0
            ? {opacity: 1, transform: "translateY(200px)"}
            : prevStep > 1
            ? {opacity: 1, transform: "translateX(-200px)"}
            : {opacity: 1, transform: "translateX(200px)"}
        }
        transition={{duration: 0.3}}
        className="w-full h-[450px] items-center justify-centers flex flex-col absolute"
      >
        <UploadManager step={step} setStep={setStep} prevStep={prevStep} />
      </motion.div>

      {/* <button
        onClick={() => setShowUploadText(!showUploadText)}
        className="fixed bottom-0 left-1/2 z-[999] p-4 border hover:text-primary"
      >
        Show upload text
      </button> */}
      {showUploadText && (
        <div className="fixed top-1/2 left-1/2 p-2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] overflow-scroll border rounded-md z-50 bg-background">
          {uploadText &&
            uploadText.map((text, index) => (
              <div key={index}>{uploadText}</div>
            ))}
        </div>
      )}
    </>
  );
};

const UploadManager = ({
  step,
  setStep,

  prevStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  prevStep: number;
}) => {
  const {
    inputFiles,
    setInputFiles,
    files,
    uploadText,
    handleCancel,
    processFiles,
    isProcessing,
  } = usePresentationCreate()!;

  useEffect(() => {
    console.log("inputFiles", inputFiles, isProcessing.current);
    if (inputFiles && !isProcessing.current) {
      console.log("Processing files....");
      isProcessing.current = true;

      const processInputFiles = async () => {
        await processFiles(inputFiles);
        setInputFiles(null);
        isProcessing.current = false;
      };
      processInputFiles();
    }
  }, [inputFiles]);

  // const {
  //   setUploadText,
  //   uploadText,
  //   saveFileToFirebase,
  //   setUploads,
  //   deleteFile,
  // } = usePresentation()!;

  //toast initiation
  const {toast} = useToast();

  // state for drag and drop
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setShowUploadDialog(false);

    await processFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop !== 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const [isOverflowing, setIsOverflowing] = useState(false);

  const determineOverflow = (element: HTMLElement) => {
    if (element) {
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    }
    return false;
  };

  useEffect(() => {
    const element = document.getElementById("upload-manager");
    if (element) {
      setIsOverflowing(determineOverflow(element));
    }
  }, [files]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={` h-full flex gap-4 items-center  flex-col w-full 
        ${isDragging ? " border-primary  " : ""}
        
        `}
    >
      {(!files || files.length === 0) && (
        <div className={`${step === 1 && "h-[450px]"} flex  items-center `}>
          <FileUploadStart setStep={setStep} isDragging={isDragging} />
        </div>
      )}
      {/* Conditional rendering for the progress bar */}
      {files && files.length > 0 && (
        <>
          {step !== 0 && (
            <div className="flex flex-col text-center items-centers gap-1 p-4 pb-0 relative">
              <Label className="poppins-bold text-xl">Uploaded Files</Label>
              <p className="poppins-regular">
                These files will be used to guide your presentation
              </p>
            </div>
          )}
          <motion.div
            className={`flex flex-col  w-[450px] relative  rounded-lg   h-fit max-h-[350px]   
              ${isDragging ? " border-primary  " : ""}
          `}
            animate={prevStep === 0 && {opacity: 1}}
            initial={prevStep === 0 && {opacity: 0}}
            transition={{duration: 0.2}}
          >
            {/* {isScrolled && (
              <div className="absolute left-0 bottom-0 translate-y-full w-full  z-30  fade-in-0 duration-500">
                <div className="upload-manager-grad-top w-full h-16 z-30 pointer-events-none"></div>
              </div>
            )} */}
            <div
              id="upload-manager"
              onScroll={onScroll}
              className={`space-y-2  flex flex-col h-fit max-h-full p-2  overflow-scroll flex-animate
              
                `}
            >
              <AnimatePresence>
                {files.map((file, index) => (
                  <ProgressBar
                    key={index}
                    fileLocal={file}
                    onCancel={handleCancel}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
            {/* {isOverflowing && (
              <div className="absolute  left-0 bottom-10  w-full pointer-events-none z-30 animate-in fade-in-0 duration-500">
              <div className="upload-manager-grad-bottom w-full h-12 z-30 pointer-events-none"></div>
              </div>
              )} */}
          </motion.div>
          <motion.div
            animate={prevStep === 0 && {opacity: 1}}
            initial={prevStep === 0 && {opacity: 0}}
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
                <FileUploadStart
                  setStep={setStep}
                  isDragging={isDragging}
                  setOpen={setShowUploadDialog}
                />
              </DialogContent>
            </Dialog>
          </motion.div>

          {step === 0 &&
            files &&
            files.every((file: FileLocal) => file.uploadProgress === 100) && (
              <Button>
                Next Step
                <Icons.chevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
        </>
      )}
    </div>
  );
};

export const ProgressBar = ({
  fileLocal,
  onCancel,

  index,
}: {
  fileLocal: FileLocal;
  onCancel: (file: FileLocal) => void;

  index: number;
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(
    fileLocal.uploadProgress
  );

  // const uploadComplete = false;
  const uploadComplete = fileLocal.uploadProgress === 100;

  useEffect(() => {
    if (fileLocal.uploadProgress === 100) return;
    setTimeout(() => {
      if (uploadProgress < 99) {
        setUploadProgress(uploadProgress + 1);
      }
    }, 500);
  }, [uploadProgress]);

  const {deleteFile} = usePresentationCreate()!;

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

      case "youtube":
        return <Icons.Youtube className=" w-5 h-5 " />;

      default:
        return <Icons.file className=" w-5 h-5 text-primary " />;
    }
  };

  const {prevStep} = usePresentationCreate()!;

  return (
    <motion.div
      // exit={{
      //   opacity: 0,
      //   transform: "translateX(-800px)",
      //   transitionEnd: {
      //     height: 0, // This will happen after opacity and transform transition
      //   },
      // }}
      initial={prevStep === 0 && {opacity: 1, transform: "translateY(500px)"}}
      animate={prevStep === 0 && {opacity: 1, transform: "translateY(0px)"}}
      transition={{duration: 0.5, delay: 0.2 * index}}
      className="w-full p-2 px-4 flex flex-col gap-2 border  bg-background rounded-lg  h-fit "
    >
      <div className="grid grid-cols-[1fr_24px] items-center gap-4">
        <div className="flex flex-col">
          <div className="flex flex-row gap-4 items-center h-fit ">
            <span className="p-2  rounded-sm border aspect-square h-fit flex items-center justify-center">
              {renderIcon()}
            </span>
            <div className="flex flex-col w-full ">
              <div className="flex items-center justify-between   ">
                <a
                  href={fileLocal.path}
                  target="_blank"
                  className="font-semibold hover:text-primary hover:underline upload-title text-ellipsis "
                >
                  {fileLocal.title}
                </a>
              </div>
              {fileLocal.file && (
                <div className="flex  relative w-full h-6">
                  {uploadComplete && (
                    <div className="text-muted-foreground ">
                      {(fileLocal.file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  )}

                  {!uploadComplete && (
                    <div className=" flex flex-col items-end  absolute left-0 bottom-0 w-full">
                      <div className="flex  gap-1">
                        <Icons.spinner className="w-4 h-4 text-primary animate-spin " />

                        <span className="text-[12px] text-primary">
                          Uploading...
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{width: `${uploadProgress}%`}}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (!uploadComplete) {
              onCancel(fileLocal);
            } else {
              deleteFile(fileLocal.path, fileLocal.id);
            }
          }}
          className="bg-gray-300 hover:bg-gray-500 transition-colors duration-500 rounded-full aspect-square h-fit p-1"
        >
          <Icons.close className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

const FileUploadStart = ({
  setStep,
  setOpen,
  isDragging,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDragging: boolean;
}) => {
  const {inputFiles, setInputFiles} = usePresentationCreate()!;

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file change");
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    setInputFiles(fileList);
    setStep(1);
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

        <div className="w-full  items-center flex flex-col gap-2 group">
          <button
            onClick={() => {
              document.getElementById("file-input")?.click();
              // setStep(1);
            }}
            className="absolute  w-full h-full z-10"
          ></button>
          <Icons.files className="w-[200px] text-primary" />
          {/* <div className="h-[80px]"></div> */}
          <span className="text-2xl font-bold">
            Drag & drop files to upload
          </span>
          <p className="text-muted-foreground">
            Supported formats: .pdf .docs .mp4 .mp3 .png .jpg
          </p>
          <div className="grid grid-cols-2 gap-4 items-center mt-2">
            <div className="w-full p-2 px-4 h-fit rounded-[12px] text-center border bg-primary text-white text-[12px] poppins-regular hover:bg-primary/90  ">
              Select files
            </div>
            <GoogleDriveImport />
          </div>
        </div>
      </div>
      <div className="flex items-center text-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-600 font-bold">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <YoutubeInput setStep={setStep} setOpen={setOpen} />
    </div>
  );
};

const YoutubeInput = ({
  setStep,
  setOpen,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);

  const {setFiles, filesRef, files, addNewUploadsText, scrapeYoutube} =
    usePresentationCreate()!;

  const {currentUser, userPresentations, setShowLoginModal} = useAuth()!;

  const handleSubmit = async () => {
    if (!currentUser && userPresentations.length >= MAX_UNSUB_GENERATIONS) {
      setShowLoginModal(true);
      return;
    } else {
      if (!url) return;
      setIsLoading(true);

      const newFile = await scrapeYoutube(url);
      setFiles([...(files || []), newFile]);
      filesRef.current = [...(files || []), newFile];
      setStep(1);
      addNewUploadsText(newFile.text);
      setIsLoading(false);
      setOpen && setOpen(false);
    }
  };

  return (
    <>
      {error && (
        <div className=" text-theme-red poppins-regular text-sm mb-2 relative z-30">
          Invalid link must be a youtube link
        </div>
      )}
      <div className="w-full border rounded-md flex relative gap-1 p-2 items-center px-4 mb-4 relative z-30">
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
// const FileUpload = ({
//   setStep,
//   setOpen,
// }: {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
//   setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const {processFiles} = usePresentationCreate()!;

//   //toast initiation
//   const {setInputFiles} = usePresentationCreate()!;

//   const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const target = event.target as HTMLInputElement;
//     const fileList = target.files;
//     setInputFiles(fileList);
//     setOpen && setOpen(false);
//     // setStep(1);
//   };

//   return (
//     <div
//       className={`overflow-hidden h-fit  border  rounded-md  p-8 bg-background/70 blurBack shadow-xl`}
//     >
//       <div
//         className={` h-fit  w-full    items-center flex flex-col gap-2 mb-2 group

//   `}
//       >
//         <input
//           id="file-input-pop"
//           style={{display: "none"}}
//           type="file"
//           accept=".pdf, .jpg, .png, .mp4, .doc, .mp3, docx"
//           onChange={(e) => {
//             onFileChange(e);
//           }}
//           multiple
//         />

//         <button
//           onClick={() => {
//             document.getElementById("file-input-pop")?.click();
//             // setStep(2);
//           }}
//           className="w-full  items-center flex flex-col gap-2 group"
//         >
//           <Icons.files className="w-[150px] text-primary" />
//           {/* <div className="h-[80px]"></div> */}
//           <span className="text-xl font-bold">Drag & drop files to upload</span>
//           <p className="text-muted-foreground">
//             Supported format: .pdf .docs .mp4 .mp3 .png .jpg
//           </p>
//           <div className="w-fit p-2 px-4 rounded-sm border bg-primary text-white  hover:bg-primary/90  ">
//             Select files
//           </div>
//         </button>
//       </div>
//       <div className="flex items-center text-center my-4">
//         <div className="flex-1 border-t border-gray-300"></div>
//         <span className="px-4 text-gray-600 font-bold">or</span>
//         <div className="flex-1 border-t border-gray-300"></div>
//       </div>
//       <GoogleDriveImport />
//     </div>
//   );
// };
