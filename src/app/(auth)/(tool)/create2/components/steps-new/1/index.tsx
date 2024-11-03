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
import {
  FILE_SIZE,
  FileLocal,
  MAX_FILE_SIZE_MB,
  UploadType,
} from "@/config/data";

import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

export const Step1 = ({
  step,
  setStep,
  prevStep,
  setPrevStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  prevStep: number;
  setPrevStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
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
        exit={{opacity: 0, transform: "translateX(-200px)"}}
        animate={{opacity: 1, transform: "translate(0px)"}}
        initial={
          prevStep === 0
            ? {opacity: 1, transform: "translateY(200px)"}
            : prevStep > 2
            ? {opacity: 1, transform: "translateX(-200px)"}
            : {opacity: 1, transform: "translateX(200px)"}
        }
        transition={{duration: 0.3}}
        className="w-full h-[450px] items-center justify-centers flex flex-col absolute"
      >
        <UploadManager step={step} setStep={setStep} prevStep={prevStep} />
      </motion.div>

      <button
        onClick={() => setShowUploadText(!showUploadText)}
        className="fixed bottom-0 left-1/2 z-[999] p-4 border hover:text-primary"
      >
        Show upload text
      </button>
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
  const isProcessing = useRef(false);

  const {
    inputFiles,
    setInputFiles,
    files,
    uploadText,
    handleCancel,
    processFiles,
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

  // Extract text from a PDF file
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdf = await pdfjs.getDocument({url: URL.createObjectURL(file)})
        .promise;
      const textPages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = (await page.getTextContent()) as any;
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        textPages.push(pageText);
      }
      return textPages.join(" ");
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast({
        variant: "destructive",
        title: `Oops!`,
        description: `Error extracting text from ${file.name}`,
      });
      return "";
    }
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
          <FileUpload setStep={setStep} />
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
                    prevStep={prevStep}
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
                <FileUpload setStep={setStep} setOpen={setShowUploadDialog} />
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

const ProgressBar = ({
  fileLocal,
  onCancel,

  index,
  prevStep,
}: {
  fileLocal: FileLocal;
  onCancel: (file: FileLocal) => void;

  index: number;
  prevStep: number;
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
              <div className="flex items-center justify-between">
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
              deleteFile(fileLocal.path);
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

const FileUpload = ({
  setStep,
  setOpen,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {processFiles} = usePresentationCreate()!;

  //toast initiation
  const {setInputFiles} = usePresentationCreate()!;

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    setInputFiles(fileList);
    setOpen && setOpen(false);
    // setStep(1);
  };

  return (
    <div
      className={`overflow-hidden h-fit  border  rounded-md  p-8 bg-background/70 blurBack shadow-xl`}
    >
      <div
        className={` h-fit  w-full    items-center flex flex-col gap-2 mb-2 group
    
  `}
      >
        <input
          id="file-input-pop"
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
            document.getElementById("file-input-pop")?.click();
            // setStep(2);
          }}
          className="w-full  items-center flex flex-col gap-2 group"
        >
          <Icons.files className="w-[150px] text-primary" />
          {/* <div className="h-[80px]"></div> */}
          <span className="text-xl font-bold">Drag & drop files to upload</span>
          <p className="text-muted-foreground">
            Supported format: .pdf .docs .mp4 .mp3 .png .jpg
          </p>
          <div className="w-fit p-2 px-4 rounded-sm border bg-primary text-white  hover:bg-primary/90  ">
            Select files
          </div>
        </button>
      </div>
      <div className="flex items-center text-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-600 font-bold">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <GoogleDriveImport />
    </div>
  );
};
