"use client";
import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";

import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {usePresentation} from "@/context/presentation-create-context";
import {Icons} from "@/components/icons";
import {Page, pdfjs} from "react-pdf";
import {app} from "@/config/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import {Document} from "react-pdf";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
export function CreatePresentationForm() {
  const {
    description,
    setDescription,
    numOfSlides,
    setNumOfSlides,
    isGenerating,
    Generate,
  } = usePresentation()!;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-muted">
      <div className="border p-4 w-[50%] bg-background  rounded-lg grid gap-4">
        <Label className="text-2xl">Let&apos;s get started!</Label>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="material">What do you want to create?</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your vision here ex.(a 5th grade level presentation about the us civil war) "
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="material">
            Resources (this could be a Study guide, textbook, paper)
          </Label>
          <StudyMaterial />
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="question-quantity">Number of Slides</Label>
          <div className="w-full flex gap-3 ">
            <Slider
              id="question-quantity"
              min={1}
              max={10}
              value={numOfSlides}
              onValueChange={setNumOfSlides}
            />
            <span className="w-[40px] flex items-center justify-center">
              {numOfSlides[0]}
            </span>
          </div>
        </div>
        <Button
          onClick={Generate}
          className="bg-gradient-to-r to-rose-600 via-indigo-500 from-blue-600  p-[2px]"
        >
          <div className="h-full w-full bg-background rounded-sm text-indigo-500 flex items-center justify-center  text-lg">
            <Icons.wand className="h-5 w-5 mr-2" />
            Generate
            {isGenerating && (
              <Icons.spinner className="animate-spin ml-2 h-5 w-5" />
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}

("The American Civil War, occurring from 1861 to 1865, was a defining conflict in U.S. history, primarily fought between the Northern states (Union) and Southern states that seceded to form the Confederate States of America. Key issues included economic differences, slavery, and states' rights.");

const StudyMaterial = () => {
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = React.useState<boolean>(false);
  const [numPages, setNumPages] = React.useState<number>(1);
  const [documentLoaded, setDocumentLoaded] = React.useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  const [recommendScan, setRecommendScan] = React.useState<boolean>(false);
  const {studyMaterialText, setStudyMaterialText} = usePresentation()!;

  const [file, setFile] = React.useState<any>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoadingUpload(true);
      setUploadedFile(event.target.files[0]);
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
      await setStudyMaterialText(extractedText);

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
            className="w-full border border-dashed p-3 rounded-[1rem] hover:border-primary"
          >
            Click to upload
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
