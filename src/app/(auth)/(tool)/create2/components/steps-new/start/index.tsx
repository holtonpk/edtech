"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useToast} from "@/components/ui/use-toast";
import {usePresentationCreate} from "@/context/presentation-create-context";
import GoogleDriveImport from "../1/google-drive-import";
import {LucideProps} from "lucide-react";
import {Button} from "@/components/ui/button";
export const Start = ({
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
  const {inputFiles, setInputFiles, processFiles} = usePresentationCreate()!;

  useEffect(() => {
    if (step === 0) setPrevStep(0);
  }, [step]);

  const isActive = step === 0;

  const [isDragging, setIsDragging] = useState(false);

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setInputFiles(event.dataTransfer.files);
    setStep(1);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{opacity: 1}}
          initial={{opacity: 1}}
          transition={{duration: 0.3}}
          exit={{opacity: 0, transform: "translateY(200px)"}}
          onDrop={onDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center pt-10 z-50 relative h-[calc(100vh-60px)] 
  w-full
      `}
        >
          <div className="h-fit relative w-full flex items-center  flex-col gap-8">
            <motion.div
              animate={{opacity: 1}}
              initial={{opacity: 0}}
              transition={{duration: 0.5, delay: 0.2}}
              exit={{opacity: 0}}
              className="flex flex-col items-center  h-[150px] top-0 gap-4"
            >
              <h1 className="text-5xl font-bold poppins-bold text-center leading-[60px]">
                Turn <i>anything</i> into a <br /> class presentation with AI
              </h1>
              <p className="poppins-regular text-center text-lg">
                Don&apos;t start from scratch. Start from a <i>PDF</i>,{" "}
                <i>Youtube Link</i>, <i>Image</i> etc.
              </p>
            </motion.div>
            <motion.div
              animate={{opacity: 1, transform: "translateY(0px)"}}
              initial={{opacity: 0, transform: "translateY(200px)"}}
              transition={{duration: 0.5, delay: 0.5}}
              exit={{opacity: 0, transform: "translateY(200px)"}}
              className="h-fit w-fit relative "
            >
              <UploadManagerStart
                setStep={setStep}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />

              <motion.div
                animate={{opacity: 1}}
                initial={{opacity: 0}}
                transition={{duration: 0.5, delay: 1}}
                exit={{opacity: 0}}
                className="flex flex-col absolute -left-10 -translate-x-full top-[30%] -translate-y-1/2 gap-1"
              >
                <h1 className=" text-center text-primary hand-font text-2xl">
                  Get started by <br />
                  uploading a resource
                </h1>
                <Arrow1 className=" h-[90px] rotate-[0deg] fill-primary ml-20 -scale-x-[1]" />
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            animate={{opacity: 1}}
            initial={{opacity: 0}}
            transition={{duration: 0.5, delay: 1}}
            exit={{opacity: 0}}
            className="flex absolute left-[80%] -translate-x-1/2 bottom-[120px] "
          >
            <h1 className=" text-center text-primary hand-font  text-2xl">
              Learn why teachers love Frizzle AI
            </h1>
            <Arrow2 className="absolute h-[90px] rotate-[80deg] fill-primary ml-20 scale-x-[1] left-[20%] -translate-x-1/2 -bottom-4 translate-y-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UploadManagerStart = ({
  setStep,
  isDragging,
  setIsDragging,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //toast initiation
  const {toast} = useToast();

  // state for drag and drop

  return (
    <div
      className={` h-fit flex gap-4 items-centers justify-center flex-col w-fit 
          
            
            `}
    >
      <FileUploadStart setStep={setStep} isDragging={isDragging} />
    </div>
  );
};

const FileUploadStart = ({
  setStep,
  isDragging,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
}) => {
  const {inputFiles, setInputFiles} = usePresentationCreate()!;

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    setInputFiles(fileList);
    setStep(1);
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
      <YoutubeInput setStep={setStep} />
    </div>
  );
};

const YoutubeInput = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);

  const {setFiles, filesRef, files, addNewUploadsText} =
    usePresentationCreate()!;

  const handleSubmit = async () => {
    if (!url) return;
    setIsLoading(true);

    const res = await fetch("/api/scrape-youtube", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        url,
      }),
    });

    const data = await res.json();

    const newFile = {
      id: Math.random().toString(),
      uploadProgress: 100,
      path: url,
      title: data.title as string,
      type: "youtube" as "youtube",
    };
    setFiles([...(files || []), newFile]);
    filesRef.current = [...(files || []), newFile];
    setStep(1);
    addNewUploadsText(data.text);
    setIsLoading(false);
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
          placeholder="enter youtube link here..."
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

const Arrow1 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 243 236"
    >
      <g clipPath="url(#clip0_374_487)" opacity="1">
        <path d="M31.972 206.562a8.429 8.429 0 01-.394-5.722 108.646 108.646 0 013.266-11.07 157.197 157.197 0 019.542-22.703 4.055 4.055 0 014.174-.807 4.058 4.058 0 012.597 3.367 70.57 70.57 0 01-3.797 11.701c-1.544 3.968-4.196 12.443-5.712 17.49l.217-.073c.541-.252 2.354-.84 3.258-1.124 6.653-2.966 13.039-6.5 19.502-9.854 38.41-19.981 70.033-40.642 101.374-69.707a236.058 236.058 0 004.413-4.106c-10.331 4.164-20.604 8.471-30.898 12.726-3.203 1.318-6.416 2.617-9.682 3.774a10.333 10.333 0 01-6.422.858c-10.307-4.285 3.778-16.066 6.811-21.427a338.92 338.92 0 0030.713-45.62 172.783 172.783 0 0018.512-58.507 4.182 4.182 0 015.864-3.665c4.28 1.945 1.737 7.315 1.559 10.907a157.428 157.428 0 01-7.547 29.994 196.402 196.402 0 01-26.483 50.795c-6.354 9.186-13.439 17.86-20.026 26.874 12.878-4.734 29.048-12.39 43.096-17.263 3.567-1.481 10.117-2.764 10.105 2.923-.77 4.173-4.725 6.988-7.272 10.177a417.839 417.839 0 01-106.097 76.514c-6.66 3.766-17.99 8.999-23.075 11.073a234.315 234.315 0 0028.302 4.005 4.022 4.022 0 013.674 3.035 4.034 4.034 0 01-5.055 4.856c-10.76-.898-21.47-2.344-32.1-4.236a56.549 56.549 0 01-7.732-1.672 7.889 7.889 0 01-4.687-3.513zm97.868-76.111l-.008.003-.02.007.028-.01zm.172-.064c.73-.268.882-.332 0 0zm0 0l-.172.064.051-.018.121-.046z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_487">
          <path
            d="M0 0H252.316V85.835H0z"
            transform="rotate(136.764 108.918 79.34)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

const Arrow2 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 346 330"
    >
      <g clipPath="url(#clip0_374_489)" opacity="1">
        <path d="M337.368 231.622c.11 5.125-3.94 38.107-14.119 50.391a11.291 11.291 0 01-15.816-.81c-7.89-7.097-15.519-14.479-23.26-21.737-3.549-4.338-10.849-7.341-10.538-13.65a7.026 7.026 0 014.939-5.848 7.041 7.041 0 013.994-.023 7.02 7.02 0 013.36 2.154c9.2 8.388 17.592 16.871 25.226 23.708a530.509 530.509 0 00-33.393-83.143c-12.695-24.769-23.152-45.315-43.03-59.621a86.749 86.749 0 00-42.148-16.644 41.555 41.555 0 01-4.288 35.821 18.386 18.386 0 01-12.857 9.377 18.4 18.4 0 01-15.362-4.156 34.082 34.082 0 01-11.15-19.412 27.089 27.089 0 01-.195-13.922 27.126 27.126 0 016.746-12.186 38.994 38.994 0 0118.489-7.48C149.771 63.509 95.347 49.679 56.13 54.305a242.533 242.533 0 00-41.525 7.474c-.254.068-.504.15-.763.2 2.915-1.002-1.36.429-3.86 1.144a7.273 7.273 0 01-2.546.527 5.024 5.024 0 01-4.099-1.537 5.81 5.81 0 011.493-9.49c1.905-.738 3.796-1.53 5.73-2.195a163.109 163.109 0 0129.509-7.583 171.45 171.45 0 01109.225 17.037 96.656 96.656 0 0137.211 33.481 95.19 95.19 0 0163.02 26.915c19.636 19.106 30.885 44.8 42.572 69.14a455.178 455.178 0 0126.638 69.776c2.452-8.083 4.832-17.867 6.937-24.889 1.068-2.962.575-2.354 1.38-4.228a5.665 5.665 0 011.801-3.008 5.264 5.264 0 015.759-.524 5.246 5.246 0 012.756 5.078zM181.602 106.291a65.227 65.227 0 00-8.037 1.183c-9.339 2.018-11.854 4.727-13.193 12.299-.549 9.055 5.87 20.438 11.44 20.693 8.192 2.589 17.193-18.411 9.79-34.175z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_489">
          <path
            fill="#fff"
            d="M0 0H303.37V283.954H0z"
            transform="scale(1 -1) rotate(9.384 2031.224 117.244)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

// const dummyFiles = [
//   {
//     file: new File([""], "test.pdf", {type: "application/pdf"}),
//     uploadProgress: 100,
//     path: "asdfa",
//     title: "1test.pdf",
//     type: "pdf" as FileLocal["type"],
//     id: "1",
//   },
//   {
//     file: new File([""], "test.pdf", {type: "application/pdf"}),
//     uploadProgress: 100,
//     path: "adfadsf",
//     title: "2test.pdf",
//     type: "jpg" as FileLocal["type"],
//     id: "2",
//   },
//   {
//     file: new File([""], "test.pdf", {type: "application/pdf"}),
//     uploadProgress: 100,
//     path: "fadasd",
//     title: "3test.pdf",
//     type: "mp4" as FileLocal["type"],
//     id: "3",
//   },
//   {
//     file: new File([""], "test.pdf", {type: "application/pdf"}),
//     uploadProgress: 100,
//     path: "hgdfgfhd",
//     title: "4test.pdf",
//     type: "pdf" as FileLocal["type"],
//     id: "4",
//   },
//   {
//     file: new File([""], "test.pdf", {type: "application/pdf"}),
//     uploadProgress: 100,
//     path: "wrwreetw",
//     title: "5test.pdf",
//     type: "pdf" as FileLocal["type"],
//     id: "5",
//   },
// ];
