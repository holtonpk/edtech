"use client";

import {motion, AnimatePresence} from "framer-motion";

import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/components/ui/use-toast";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Document, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import GoogleDriveImport from "./google-drive-import";
import {
  FILE_SIZE,
  FileLocal,
  MAX_FILE_SIZE_MB,
  UploadType,
} from "@/config/data";
import NavigationButtons from "../../navigation-buttons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Position} from "../../../../edit/[projectId]/editor/slide-selector/slide-menu/Mini-Slide";
import StepContainer from "../step-container";

export const Step2 = ({
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
    setPrevStep(2);
  }, []);

  return (
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
      className="w-full h-[350px] items-center justify-center flex flex-col  absolute"
    >
      <div className="flex flex-col items-center max-w-[50%] text-center">
        <h1 className="poppins-bold text-xl">Upload Resources</h1>
        <p className="poppins-regular text-muted-foreground">
          Upload the files that you would like to include in your presentation.
        </p>
      </div>
      <UploadManager />
    </motion.div>
  );
};

const UploadManager = () =>
  //     {
  //   files,
  //   setFiles,
  // }: {
  //   files: FileLocal[] | undefined;
  //   setFiles: React.Dispatch<React.SetStateAction<FileLocal[] | undefined>>;
  // }
  {
    const [files, setFiles] = useState<FileLocal[] | undefined>(undefined);
    //   state to store the uploaded file and uploaded text
    const {
      setUploadText,
      uploadText,
      saveFileToFirebase,
      setUploads,
      deleteFile,
    } = usePresentation()!;

    //toast initiation
    const {toast} = useToast();

    // state for drag and drop
    const [isDragging, setIsDragging] = useState(false);

    //helper function to get file type
    const getFileType = (
      file: File
    ):
      | "pdf"
      | "jpg"
      | "jpeg"
      | "png"
      | "mp4"
      | "mp3"
      | "doc"
      | "docx"
      | undefined => {
      if (file.type === "application/pdf") return "pdf";
      if (file.type === "image/jpeg") return "jpg";
      if (file.type === "image/png") return "png";
      if (file.type === "video/mp4") return "mp4";
      if (file.type === "audio/mpeg") return "mp3";
      if (file.type === "application/msword") return "doc";
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return "docx";
      return undefined; // Default type if not matched
    };

    const handleProgressUpdate = (file: File, progress: number) => {
      console.log(
        `Updating progress for file: ${file.name}, progress: ${progress}`
      );
      setFiles((prevFiles) =>
        prevFiles?.map((f) =>
          f.file === file
            ? {...f, uploadProgress: Math.min(progress, 100)} // Ensure progress is capped at 100%
            : f
        )
      );
    };

    const processFiles = async (fileList: FileList | File[]) => {
      try {
        const filesArray = Array.from(fileList);

        const vaildFiles = filesArray.filter((file) => {
          const fileType = getFileType(file);

          if (!fileType) {
            console.log("Unsupported File Type");
            toast({
              variant: "destructive",
              title: "Unsupported File Type",
              description: `${file.name} is not a supported file type.`,
            });
            return false;
          }

          if (file.size > MAX_FILE_SIZE_MB) {
            console.log("File Too Large");
            toast({
              variant: "destructive",
              title: "File Too Large",
              description: `${file.name} exceeds the ${FILE_SIZE}MB limit.`,
            });
            return false;
          }
          return true;
        });

        const newFiles = vaildFiles.map((file) => ({
          file,
          uploadProgress: 100,
          path: URL.createObjectURL(file),
          title: file.name,
          type: getFileType(file),
        }));

        setFiles((prevFiles: any) => {
          const updatedFiles = [...(prevFiles || []), ...newFiles];
          return updatedFiles;
        });

        for (const fileLocal of newFiles) {
          await uploadFile(fileLocal as FileLocal);
        }
      } catch (error) {
        console.error("Error processing the files ", error);
        toast({
          variant: "destructive",
          title: "Error Processing Files",
          description:
            "An unexpected error occurred while processing the files.",
        });
      }
    };

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      // function to handle the file change event

      // how i would handle the file change event
      // 1.) get the file from the event
      // 2.) determine what type of file it is
      // 3.) save the file to firestore so text layer can be extracted with uploadFile()
      // 3.) extract the text layer of the file
      // 4.) save the file to the context states with addNewFile()

      const target = event.target as HTMLInputElement;
      const fileList = target.files;

      if (!fileList || fileList.length === 0) {
        console.log("No files selected");
        toast({
          title: "No file selected",
          description: "Please select a file to proceed further.",
        });
        return;
      }
      await processFiles(fileList);
    };

    async function addNewUploads(file: FileLocal) {
      // this function will be where you save the states for the file - Saving Uploads
      if (file) {
        setUploads((prev) => [
          ...(prev || []),
          {
            title: file.title,
            id: file.title,
            path: file.path,
            type: file.type as UploadType["type"],
            file: file.file,
          },
        ]);
      }
    }

    async function addNewUploadsText(text: string) {
      console.log("setting", text);
      console.log("setting 2", [...(uploadText || []), text]);
      setUploadText([...(uploadText || []), text]);
    }

    async function uploadFile(fileLocal: FileLocal) {
      try {
        const upload = await saveFileToFirebase(
          fileLocal.file,
          (progress: number) => {
            handleProgressUpdate(fileLocal.file, progress);
          }
        );

        if (!upload || !upload.path) {
          console.error("Upload failed or no URL returnd");
          toast({
            variant: "destructive",
            title: "File upload failed!",
            description: `Upload failed or no URL returned`,
          });
        }

        const updatedFileLocal = {
          ...fileLocal,
          path: upload?.path || fileLocal.path,
        };

        setFiles((prevFiles) =>
          prevFiles?.map((f) =>
            f.file === fileLocal.file ? updatedFileLocal : f
          )
        );

        console.log("File Uploaded Successfully");
        toast({
          title: "File uploaded successfully!",
          description: `${fileLocal.title} was uploaded successfully!`,
        });

        // TEXT CONVERSION IS HAPPENING HERE _______________________
        if (fileLocal.type === "pdf") {
          const extractedText = await extractTextFromPDF(fileLocal.file);

          // Saving text to uploads text

          if (extractedText.length > 0) {
            console.log("Extracted text from PDF 3: ", extractedText);
            await addNewUploadsText(extractedText);
          }
        } else if (
          fileLocal.type === "png" ||
          fileLocal.type === "jpg" ||
          fileLocal.type === "jpeg"
        ) {
          // This ISNT WORKING EITHER SINCE THE ROUTE ISNT SETUP PROPERLY BECAUSE OF MISSING KEYS :(
        }

        if (upload) {
          // Saving uploads
          await addNewUploads(updatedFileLocal);
        }

        return updatedFileLocal;
        // More stuff here maybe
      } catch (error) {
        console.error("File Upload Failed: ", error);
        toast({
          variant: "destructive",
          title: "Uh Oh! Something went Wrong.",
          description:
            "An error occured while uploading the file. Please retry later.",
        });
        return null;
      }
    }

    const handleCancel = async (file: FileLocal) => {
      try {
        console.log(`Clicked cancel button -> ${JSON.stringify(file)}`);
        if (file.path) {
          // Delete from DB
          await deleteFile(file.path);
          toast({
            title: "File deleted.",
            description: `${file.title} has been deleted successfully.`,
          });

          // Delete from local state
          setFiles(
            (prevFiles) =>
              prevFiles?.filter((f) => f.path !== file.path) || undefined
          );

          // Also update the uploads state in the context
          setUploads(
            (prevUploads) =>
              prevUploads?.filter((u) => u.path !== file.path) || undefined
          );
        } else {
          console.error("No File Path provided for deletion");
        }
      } catch (error) {
        console.error("Error deleting file: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to delete ${file.title}. Please try again.`,
        });
      }
    };

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

    const ProgressBar = ({
      fileLocal,
      onCancel,
    }: {
      fileLocal: FileLocal;
      onCancel: (file: FileLocal) => void;
    }) => {
      const uploadComplete = fileLocal.uploadProgress === 100;

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
        <div className="w-full p-4 flex flex-col gap-2 border border-gray-300 bg-background rounded-lg ">
          <div className="grid grid-cols-[1fr_24px] items-center gap-4">
            <div className="flex flex-col">
              <div className="flex flex-row gap-4">
                <span className="p-2 rounded-sm border aspect-square h-fit flex items-center justify-center">
                  {renderIcon()}
                </span>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{fileLocal.title}</span>
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    <div className="text-muted-foreground">
                      {(fileLocal.file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                    {!uploadComplete && (
                      <span className="text-primary font-bold  w-[50px]">{`${Math.ceil(
                        fileLocal.uploadProgress
                      ).toFixed(0)}%`}</span>
                    )}
                  </div>
                </div>
              </div>
              {!uploadComplete && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{width: `${fileLocal.uploadProgress}%`}}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => onCancel(fileLocal)}
              className="bg-gray-300 hover:bg-gray-500 transition-colors duration-500 rounded-full aspect-square h-fit p-1"
            >
              <Icons.close className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      );
    };

    const [showUploadDialog, setShowUploadDialog] = useState(false);

    return (
      <div
        onDrop={onDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`overflow-hidden h-fit  border  rounded-md  p-8 bg-background/70 blurBack shadow-xl
        ${isDragging ? " border-primary  " : ""}
        
        `}
      >
        <Toaster />
        {(!files || files.length === 0) && (
          <>
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
                }}
                className="w-full  items-center flex flex-col gap-2 group"
              >
                <Icons.files className="w-[150px] text-primary" />
                {/* <div className="h-[80px]"></div> */}
                <span className="text-xl font-bold">
                  Drag & drop files to upload
                </span>
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
          </>
        )}
        {/* Conditional rendering for the progress bar */}
        {files && files.length > 0 && (
          <div
            className={`grid gap-2
           
          `}
          >
            <div className="flex justify-between items-center">
              <Label className="font-bold text-xl">Uploaded Files</Label>
            </div>
            <div className="space-y-2 overflow-y-auto flex flex-col h-fit ">
              {files.reverse().map((file, index) => (
                <ProgressBar
                  key={index}
                  fileLocal={file}
                  onCancel={handleCancel}
                />
              ))}
            </div>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger>
                <Button
                  className="w-fit text-primary mx-auto"
                  variant={"ghost"}
                >
                  <Icons.add className="w-5 h-5  mr-2" />
                  Upload More
                </Button>
              </DialogTrigger>
              <DialogContent>
                <>
                  <div
                    className={` w-full border-4 border-dashed rounded-[1rem] hover:border-primary items-center flex flex-col gap-2 mb-2 group
            ${
              isDragging
                ? " border-primary bg-primary/10 "
                : " border-dashed hover:border-primary "
            }
          `}
                  >
                    <input
                      id="file-input"
                      style={{display: "none"}}
                      type="file"
                      accept=".pdf, .jpg, .png, .mp4, .doc, .mp3, docx"
                      onChange={(e) => {
                        onFileChange(e);
                        setShowUploadDialog(false);
                      }}
                      multiple
                    />

                    <button
                      onClick={() => {
                        document.getElementById("file-input")?.click();
                      }}
                      className="w-full p-4 rounded-[1rem] hover:border-primary items-center flex flex-col gap-2 mb-2"
                    >
                      <Icons.upload className="w-10 h-10 text-primary" />
                      <span className="text-xl font-bold"> Import a file</span>
                      <p className="text-muted-foreground">
                        <span className="underline group-hover:text-primary font-bold">
                          Click to upload
                        </span>{" "}
                        or drag and drop <br />
                        Supported format: .pdf .docs .mp4 .mp3 .png .jpg
                      </p>
                    </button>
                  </div>
                  {/* <div className="flex items-center text-center my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-600 font-bold">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  <GoogleDriveImport /> */}
                </>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* {!files && (
          <>
            <div className="grid grid-cols-[45%_1fr_45%] items-center ">
              <div className="w-full h-[1px] bg-muted-foreground/40" />
              <span className="text-center text-muted-foreground/40">OR</span>
              <div className="w-full h-[1px] bg-muted-foreground/40" />
            </div>
            <ImportFromUrl />
          </>
        )} */}
      </div>
    );
  };
