"use client";
import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import {Document, pdfjs} from "react-pdf";
import {app} from "@/config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import {motion} from "framer-motion";
import StepContainer from "./step-container";
const Uploads = () => {
  return (
    <StepContainer
      title="Upload Resources"
      subTitle="This could be a study guide, textbook, paper"
    >
      <StudyMaterial />
      <div className="grid grid-cols-[45%_1fr_45%] items-center">
        <div className="w-full h-[2px]  bg-muted-foreground/40" />
        <span className="text-center text-muted-foreground/40">OR</span>
        <div className="w-full h-[2px] bg-muted-foreground/40" />
      </div>
      <ImportFromUrl />
    </StepContainer>
  );
};

export default Uploads;

const StudyMaterial = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = React.useState<boolean>(false);
  const [numPages, setNumPages] = React.useState<number>(1);
  const [documentLoaded, setDocumentLoaded] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  const [recommendScan, setRecommendScan] = React.useState<boolean>(false);
  const {setUploadText, uploadText, setUploads} = usePresentation()!;

  const [file, setFile] = React.useState<any>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoadingUpload(true);
      setUploads(event.target.files[0]);
      try {
        const upload = await uploadFile(event.target.files[0]);
        setFile(upload);
        console.log("upload==========", upload);
      } catch (error) {
        console.error("Failed to upload file:", error);
      } finally {
        setIsLoadingUpload(false);
      }
    }
  };

  async function uploadFile(file: File) {
    try {
      const fileID = Math.random().toString(36).substring(7);
      const storage = getStorage(app);
      const fileRef = ref(storage, fileID);
      const uploadTask = uploadBytesResumable(fileRef, file);
      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");

            setUploadProgress(progress - 70);

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot.ref);
          }
        );
      });

      // Get download URL and return the upload object
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at", downloadURL);
      const upload = {
        title: file.name,
        id: fileID,
        path: downloadURL,
        type: "pdf",
      };

      // setUploadData(upload as UploadType);
      return upload;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Rethrow the error after logging it
    }
  }

  const cancelUpload = React.useRef(false);

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    // Function to check if the operation should proceed
    const checkCancellation = () => {
      if (cancelUpload.current) {
        throw new Error("Operation cancelled");
      }
    };

    try {
      const textPromises = [];
      for (let i = 1; i <= numPages; i++) {
        checkCancellation(); // Check if we should continue before starting the next operation

        const loadingTask = pdfjs.getDocument({url: file.path});
        const promise = loadingTask.promise.then(async (pdf) => {
          checkCancellation(); // Check again after loading the document

          const page = await pdf.getPage(i);
          checkCancellation(); // Check before getting the text content

          const textContent = await page.getTextContent();
          checkCancellation(); // Check after getting the text content

          const hasTextLayer = textContent.items.length > 0;
          setUploadProgress(30 + (i / numPages) * 70);

          if (!hasTextLayer) {
            setRecommendScan(true);
            return;
          }

          return textContent.items.map((item: any) => item.str).join(" ");
        });
        textPromises.push(promise);
      }

      const pageTexts = await Promise.all(textPromises);
      checkCancellation(); // Check before processing the result
      const extractedText = pageTexts.join(" ");
      await setUploadText([...(uploadText || []), extractedText]);

      console.log("extractedText==========", extractedText);
    } catch (error: any) {
      if (error.message !== "Operation cancelled") {
        console.error("Failed to extract PDF text:", error);
      }
    } finally {
      if (!cancelUpload.current) {
        setDocumentLoaded(true);
        setNumPages(numPages);
      }
    }
  }

  console.log("uploadText", uploadText);

  return (
    <>
      {!file ? (
        <>
          <input
            id="file-input"
            style={{display: "none"}}
            type="file"
            accept=".pdf"
            onChange={onFileChange}
          />
          <button
            onClick={() => document.getElementById("file-input")?.click()}
            className="w-full border-4 border-dashed p-8 rounded-[1rem] hover:border-primary items-center flex flex-col gap-2"
          >
            <Icons.upload className="w-10 h-10 text-primary" />
            <span className="text-xl font-bold"> Import a file</span>
            <p className="text-muted-foreground">
              Maximum file size: 50mb <br />
              Supported format: .pdf .docs .mp4 .mp3
            </p>
          </button>
        </>
      ) : (
        <>
          <Document
            className={`invisible fixed pointer-events-none`}
            file={file.path}
            onLoadSuccess={onDocumentLoadSuccess}
          />
          <div className="grid grid-cols-[30px_1fr]  w-full p-2 border rounded-2xl">
            <button onClick={() => setFile(null)} className="text-primary">
              <Icons.close className="w-5 h-5" />
            </button>
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {file?.title}
            </span>
          </div>
        </>
      )}
    </>
  );
};

const ImportFromUrl = () => {
  const scrapeURL = async (url: string) => {
    // this will scrape the url and return the text
    return null;
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="url">Import From URL</Label>
      <div className="w-full relative">
        <input
          type="text"
          id="url"
          className="w-full p-2 border rounded-md pl-4"
          placeholder="Add file url"
        />
        <Button
          variant={"ghost"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
        >
          Upload
        </Button>
      </div>
    </div>
  );
};
