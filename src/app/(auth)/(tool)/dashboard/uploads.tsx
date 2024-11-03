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
                {uploadComplete && (
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

const FileUpload = ({
  files,
  setFiles,
}: {
  files: FileLocal[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileLocal[] | undefined>>;
}) => {
  const {
    setUploadText,
    uploadText,
    saveFileToFirebase,
    setUploads,
    deleteFile,
  } = usePresentation()!;

  //toast initiation
  const {toast} = useToast();

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
        id: Math.random().toString(36).substr(2, 9),
      }));

      console.log("New Files: ", newFiles);
      setFiles((prevFiles) => {
        const updatedFiles = [...(prevFiles || []), ...newFiles];
        return updatedFiles;
      });

      for (const fileLocal of newFiles) {
        await uploadFile(fileLocal);
      }
    } catch (error) {
      console.error("Error processing the files ", error);
      toast({
        variant: "destructive",
        title: "Error Processing Files",
        description: "An unexpected error occurred while processing the files.",
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

      // TEXT CONVERSION IS HAPPENING HERE _______________________
      if (fileLocal.type === "pdf") {
        const extractedText = await extractTextFromPDF(fileLocal.file);

        // Saving text to uploads text

        if (extractedText.length > 0) {
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

  return (
    <div
      className={`overflow-hidden h-fit  border  rounded-md  p-8 bg-background/70 blurBack shadow-xl`}
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
      {/* <GoogleDriveImport /> */}
    </div>
  );
};
