"use client";

import React, {
  useContext,
  useRef,
  createContext,
  useEffect,
  useState,
} from "react";
import {presentationResponse} from "@/types";
import {
  FileLocal,
  SlideData,
  UploadType,
  UnformattedResponse,
  MAX_FILE_SIZE_MB,
} from "@/config/data";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import {Document, pdfjs} from "react-pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {set} from "zod";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PresentationContextType {
  // states -----------------------------
  studyMaterial: string;
  setStudyMaterial: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  numOfSlides: number[];
  setNumOfSlides: React.Dispatch<React.SetStateAction<number[]>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  slideData: SlideData | undefined;
  setSlideData: React.Dispatch<React.SetStateAction<SlideData | undefined>>;
  uploadText: string[] | undefined;
  setUploadText: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  uploads: File[] | UploadType[] | undefined;
  setUploads: React.Dispatch<React.SetStateAction<UploadType[] | undefined>>;
  inputFiles: FileList | null;
  setInputFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  files: FileLocal[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileLocal[] | undefined>>;
  filesRef: React.MutableRefObject<FileLocal[] | undefined>;
  // functions -----------------------------

  GenerateAiPresentation: () => Promise<UnformattedResponse>;
  deleteFile: (file: string) => Promise<void>;
  handleCancel: (file: FileLocal) => Promise<void>;
  processFiles: (fileList: FileList | File[]) => Promise<void>;
  addNewUploadsText: (text: string) => Promise<void>;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentationCreate() {
  return useContext(PresentationContext);
}

interface Props {
  children?: React.ReactNode;
}

export const PresentationCreateProvider = ({children}: Props) => {
  // states -----------------------------
  const [title, setTitle] = useState<string>("");
  const [studyMaterial, setStudyMaterial] = useState<string>("");
  // const [gradeLevel, setGradeLevel] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [numOfSlides, setNumOfSlides] = useState<number[]>([5]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [uploadText, setUploadText] = useState<string[] | undefined>([]);
  const [uploads, setUploads] = useState<UploadType[] | undefined>([]);

  // const [slideData, setSlideData] = useState<SlideData | undefined>(DummyData);
  const [slideData, setSlideData] = useState<SlideData | undefined>(undefined);

  const router = useRouter();
  // functions -----------------------------
  async function GenerateAiPresentation(): Promise<UnformattedResponse> {
    const response = await fetch("/api/gen-presentation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uploadText: uploadText?.join(" "),
        description:
          "a fun detailed presentation to present the material to my class ",
        // description,
        numOfSlides: 8,
      }),
    });
    const data = await response.json();
    console.log("data === ", data);
    return data.response;
  }

  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [files, setFiles] = useState<FileLocal[] | undefined>(undefined);
  const filesRef = useRef<FileLocal[] | undefined>(undefined);

  const cancelUpload = useRef<boolean>(false);

  const saveFileToFirebase = async (
    fileID: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<FileLocal> => {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, fileID);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 70;

            onProgress(progress);

            // switch (snapshot.state) {
            //   case "paused":
            //     break;
            //   case "running":
            //     break;
            // }
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

      const upload: FileLocal = {
        title: file.name,
        uploadProgress: 100,
        // id: fileID,
        path: downloadURL,
        type: file.type as UploadType["type"],
        file,
        id: Math.random().toString(36).substr(2, 9),
      };

      // setUploadData(upload as UploadType);
      return upload;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Rethrow the error after logging it
    }
  };

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      console.log("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file. ", error);
      throw error;
    }
  };

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

  const handleProgressUpdate = (fileId: string, progress: number) => {
    console.log(`setting progress to: ${progress}`);

    const filesWithUpdatedProgress = filesRef.current?.map((f) =>
      f.id === fileId
        ? {...f, uploadProgress: Math.min(progress, 100)} // Ensure progress is capped at 100%
        : f
    );

    setFiles(filesWithUpdatedProgress);
    filesRef.current = filesWithUpdatedProgress;
  };

  const processFiles = async (fileList: FileList | File[]) => {
    try {
      const filesArray = Array.from(fileList);
      const vaildFiles = filesArray.filter((file) => {
        const fileType = getFileType(file);

        if (!fileType) {
          console.log("Unsupported File Type");
          //  display error here
          return false;
        }

        if (file.size > MAX_FILE_SIZE_MB) {
          console.log("File Too Large");
          //  display error here
          return false;
        }
        return true;
      });

      const newFiles = vaildFiles.map((file) => ({
        file,
        uploadProgress: 0,
        path: URL.createObjectURL(file),
        title: file.name,
        type: getFileType(file),
        id: Math.random().toString(36).substr(2, 9),
      }));

      const updatedFiles = [...(filesRef.current || []), ...newFiles];
      setFiles(updatedFiles);
      filesRef.current = updatedFiles;

      // setFiles((prevFiles) => {
      //   const updatedFiles = [...(prevFiles || []), ...newFiles];
      //   return updatedFiles;
      // });

      for (const fileLocal of newFiles) {
        await uploadFile(fileLocal);
      }
    } catch (error) {
      console.error("Error processing the files ", error);
      //  display error here
    }
  };

  // async function addNewUploads(file: FileLocal) {
  //   // this function will be where you save the states for the file - Saving Uploads
  //   if (file) {
  //     setUploads((prev) => [
  //       ...(prev || []),
  //       {
  //         title: file.title,
  //         id: file.title,
  //         path: file.path,
  //         type: file.type as UploadType["type"],
  //         file: file.file,
  //       },
  //     ]);
  //   }
  // }

  const addNewUploadsText = async (text: string) => {
    setUploadText([...(uploadText || []), text]);
  };

  async function uploadFile(fileLocal: FileLocal) {
    try {
      const fileID = Math.random().toString(36).substring(7);
      if (!fileLocal.file) return;
      const upload = await saveFileToFirebase(
        fileID,
        fileLocal.file,
        (progress: number) => {
          handleProgressUpdate(fileLocal.id, progress);
        }
      );

      if (!upload || !upload.path) {
        console.error("Upload failed or no URL returnd");
        //  display error here
      }

      const updatedFileLocal = {
        ...fileLocal,
        uploadProgress: 70,
        path: upload?.path || fileLocal.path,
      };

      const updatedFiles = filesRef.current?.map((f) =>
        f.file === fileLocal.file ? updatedFileLocal : f
      );
      setFiles(updatedFiles);
      filesRef.current = updatedFiles;

      // setFiles((prevFiles) =>
      //   prevFiles?.map((f) =>
      //     f.file === fileLocal.file ? updatedFileLocal : f
      //   )
      // );

      // TEXT CONVERSION IS HAPPENING HERE _______________________
      if (fileLocal.type === "pdf") {
        const extractedText = await extractTextFromPDF(
          fileID,
          fileLocal.file,
          (progress: number) => {
            handleProgressUpdate(fileLocal.id, progress);
          }
        );

        // Saving text to uploads text

        if (extractedText.length > 0) {
          await addNewUploadsText(extractedText);
        }
      } else if (
        fileLocal.type === "png" ||
        fileLocal.type === "jpg" ||
        fileLocal.type === "jpeg"
      ) {
        const imageText = await scanImageForText(fileID);
        await addNewUploadsText(imageText);
        handleProgressUpdate(fileLocal.id, 100);
      } else if (fileLocal.type === "mp3") {
        console.log("audio file");
        const audioText = await scanAudioForText(fileID);
        await addNewUploadsText(audioText);
        handleProgressUpdate(fileLocal.id, 100);
      } else if (fileLocal.type === "mp4") {
        console.log("video file");
        const videoText = await scanVideoForText(fileID);
        await addNewUploadsText(videoText);
        handleProgressUpdate(fileLocal.id, 100);
      }

      // if (upload) {
      //   // Saving uploads
      //   await addNewUploads(updatedFileLocal);
      // }

      return updatedFileLocal;
      // More stuff here maybe
    } catch (error) {
      console.error("File Upload Failed: ", error);
      //  display error here
      return null;
    }
  }

  const extractTextFromPDF = async (
    fileID: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    // Function to check if the operation should proceed
    const checkCancellation = () => {
      if (cancelUpload.current) {
        throw new Error("Operation cancelled");
      }
    };

    try {
      const pdf = await pdfjs.getDocument({url: URL.createObjectURL(file)})
        .promise;

      let progress = 70;

      const textPages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        checkCancellation(); // Check if we should continue before starting the next operation

        const page = await pdf.getPage(pageNumber);
        checkCancellation(); // Check before getting the text content

        const textContent = await page.getTextContent();
        checkCancellation(); // Check after getting the text content

        const hasTextLayer = textContent.items.length > 0;
        console.log("hasTextLayer", hasTextLayer);
        progress += 30 / pdf.numPages;
        onProgress(progress);
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (!hasTextLayer) {
          console.log("------------------ OCR -----------------");
          const ocrResult = await scanPdfForText(fileID);
          onProgress(100);

          return ocrResult;
        }

        textPages.push(
          textContent.items.map((item: any) => item.str).join(" ")
        );
      }

      return textPages.join(" ");
    } catch (error: any) {
      if (error.message !== "Operation cancelled") {
        console.error("Failed to extract PDF text:", error);
      }
      return "";
    }
  };

  const scanPdfForText = async (fileName: string): Promise<string> => {
    try {
      // Send a POST request to initiate PDF-to-text conversion
      const response = await fetch("/api/convert-pdf-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName}),
      });

      if (!response.ok) {
        console.error("Conversion API response error:", response.statusText);
        return "Failed to extract text due to API error.";
      }

      const data = await response.json();

      // Assuming getTextFromJSON returns a promise that resolves with the extracted text
      const text = await getTextFromJSON(fileName);

      return text;
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
      return "Failed to extract text due to an unexpected error.";
    }
  };

  const scanImageForText = async (fileName: string): Promise<string> => {
    try {
      // Send a POST request to initiate PDF-to-text conversion
      const response = await fetch("/api/convert-image-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName}),
      });

      if (!response.ok) {
        console.error("Conversion API response error:", response.statusText);
        return "Failed to extract text due to API error.";
      }

      const data = await response.json();

      // Assuming getTextFromJSON returns a promise that resolves with the extracted text
      const text = data.text;

      return text;
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
      return "Failed to extract text due to an unexpected error.";
    }
  };

  const scanAudioForText = async (fileName: string): Promise<string> => {
    try {
      // Send a POST request to initiate PDF-to-text conversion
      const response = await fetch("/api/convert-audio-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName}),
      });

      if (!response.ok) {
        console.error("Conversion API response error:", response.statusText);
        return "Failed to extract text due to API error.";
      }

      const data = await response.json();

      // Assuming getTextFromJSON returns a promise that resolves with the extracted text
      const text = data.text;

      return text;
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
      return "Failed to extract text due to an unexpected error.";
    }
  };

  const scanVideoForText = async (fileName: string): Promise<string> => {
    try {
      // Send a POST request to initiate PDF-to-text conversion
      const response = await fetch("/api/convert-video-to-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName}),
      });

      if (!response.ok) {
        console.error("Conversion API response error:", response.statusText);
        return "Failed to extract text due to API error.";
      }

      const data = await response.json();

      // Assuming getTextFromJSON returns a promise that resolves with the extracted text
      const text = data.text;

      return text;
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
      return "Failed to extract text due to an unexpected error.";
    }
  };

  const getTextFromJSON = async (fileID: string): Promise<string> => {
    try {
      const storage = getStorage(app);
      const folderRef = ref(storage, fileID);
      const files = await listAll(folderRef);
      const fileData = files.items[0];
      const url = await getDownloadURL(fileData);
      const response = await fetch(url);
      const data = await response.json();
      let text = "";
      data.responses.forEach((response: any) => {
        text += response.fullTextAnnotation.text;
      });
      return text;
    } catch (e) {
      console.log("error", e);
      return "error";
    }
  };

  const handleCancel = async (file: FileLocal) => {
    try {
      console.log(`Clicked cancel button -> ${JSON.stringify(file)}`);
      if (file.path) {
        // Delete from DB
        await deleteFile(file.path);
        //  display error here

        // Delete from local state
        const updatedFiles = filesRef.current?.filter(
          (f) => f.path !== file.path
        );
        setFiles(updatedFiles);
        filesRef.current = updatedFiles;

        // setFiles(
        //   (prevFiles) =>
        //     prevFiles?.filter((f) => f.path !== file.path) || undefined
        // );

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
      //  display error here
    }
  };

  const values = {
    // states -----------------------------
    title,
    setTitle,
    studyMaterial,
    setStudyMaterial,
    description,
    setDescription,
    numOfSlides,
    setNumOfSlides,
    isGenerating,
    setIsGenerating,
    uploadText,
    setUploadText,
    uploads,
    setUploads,
    slideData,
    setSlideData,
    inputFiles,
    setInputFiles,
    files,
    setFiles,
    filesRef,
    // functions -----------------------------
    GenerateAiPresentation,
    deleteFile,
    handleCancel,
    processFiles,
    addNewUploadsText,
  };

  return (
    <PresentationContext.Provider value={values}>
      {children}
    </PresentationContext.Provider>
  );
};

export default PresentationContext;

const dummyUploadText = `Throughout my years, I’ve been captivated by the stories that shape our  world – tales of determination, of individuals rising against odds, of  dreams sculpting realities. The world is teeming with success stories, each  as unique as the fingerprints of those who forged them. But as I navigated  my way through countless tales of triumphs and trials, I noticed a void.  While there were countless expansive biographies and technical business  texts, there was a lack of compelling narratives that could inspire us in  mere minutes. I envisioned a collection that could be savored during brief  moments stolen from a bustling day—a coffee break, a short commute, or  those fleeting minutes before sleep.  “Snapshots of Success” is the culmination of that vision. It is  a passion project, fueled by my deep respect for the indomitable spirit  of entrepreneurs and an earnest desire to offer nuggets of inspiration to  dreamers everywhere. Every narrative chosen, every entrepreneur’s story  penned down, has been a personal journey for me, intertwining my pas -  sion for storytelling with my respect for the world’s changemakers. This is  not just a book; it’s a labor of love, capturing the essence of the entrepre -  neurial journey.  Preface Justin Kan  Bernard Arnault  Tyler Perry  Ray Kroc  Elon Musk  Mrs. B  Howard Schultz  Michael Dell  Austin Russell  Mr. Beast  Richard Branson  Pavel Durov  Reed Hastings  Tope Awotona  Ingvar Kamprad  Travis Kalanick  Whitney Wolfe Herd  Jan Koum  The Collison Brothers  Masayoshi Son  Peter Thiel  Michael Rubin  Mark Zuckerberg  Sophia Amoruso  Palmer Luckey  Jamie Siminoff  Phil Knight  Shahid Khan  Dave Portnoy  Tony Xu  Stewart Butterfield  Henry Ford  Felix Dennis  Dana White  Oprah Winfrey  Jeff Bezos  Samwer Brothers  Ben Francis  Steve Ells  Luis von Ahn  Walt Disney  Mark Cuban  Sam Altman  Marc Lore  Flexport  Rocket Labs  Melanie Perkins  Apoorva Mehta  Steve Jobs  Sam Zemurray  1   80  4   83  14   93  7   86  10   89  17   96  20   99  23   102  26   105  29   108  33   111  36   114  39   118  42   121  45   125  48   129  53   133  56   136  59   139  62   142  65   145  68   148  71   151  74   154  77   157  Contents Entrepreneurship is about more than just profits and losses. It is about  heartbeats, relentless pursuits, and the unyielding spirit that rises from  failures to embrace success. “Snapshots of Success” is a curated journey  through the tapestry of such dreams and realities. Through these pages,  you will traverse the lives of 50 trailblazers, witnessing their lowest lows  and their highest highs. You will delve deep into the moments of doubt,  the leaps of faith, and the tireless perseverance that define each journey.  You will read stories of people who, just like you, started with a dream,  navigated through storms and transformed their vision into ventures that  left an indelible mark on the business realm.  But more than the tales of their success, this collection seeks to  unveil the person behind the business, making it a profoundly human  experience. The ethos of this book is to inspire, but also to remind readers  that success isn’t just about the destination; it’s profoundly about the jour -  ney. Whether you’re an aspiring entrepreneur at the cusp of a new venture  or a seasoned veteran seeking a spark of inspiration, these tales promise  insights, lessons, and above all, a reflection of a human’s innate drive to  create, conquer, and thrive.  Introduction 1  This college student’s seemingly silly idea exploded into an online revolu -  tion. A hat, a camera, and a vision led to a nearly billion-dollar handshake.  Let’s uncover the mastermind behind the game-changer.  After graduating from Yale with a double major in physics and  philosophy, Justin Kan, armed with a curious mind and a desire to make  his mark in the world, embarked on a path that would change the face of  live streaming and gaming forever.  The story began when Justin launched Justin.tv, a platform where  he lifecasted every moment of his daily life using a camera affixed to his  cap. This concept of “lifecasting” was novel and quickly captured the  world’s attention. Media outlets clamored for interviews with Justin to  delve deeper into this fascinating idea and the platform itself.  Justin Kan  1 2  However, as Justin explored the possibilities of his creation, he  realized its potential beyond just lifecasting. Together with his friends  Emmett Shear, Michael Seibel, and Kyle Vogt, he relaunched Justin.tv in  2007, this time allowing other users to create their own channels and lives -  tream anything they wanted.  The platform’s popularity soared as it attracted millions of viewers  to watch everything from football to UFC. Within a year, Justin.tv boast -  ed over 30,000 broadcasting accounts and started expanding its horizons,  adding various categories to cater to a diverse audience. Among these new  categories, gaming streams emerged as the most popular and compelling  content, attracting a massive and dedicated following.  The success of gaming streams inspired Justin to create a dedi -  cated platform for gamers. Thus, on June 6, 2011, Twitch.tv was born, a  live streaming service exclusively for gaming enthusiasts. Twitch quickly  became a sensation in the gaming community, drawing over 35 million  unique visitors every month by 2013. The platform’s meteoric rise earned  it a place as a leader in the industry.  The burgeoning popularity of Twitch led to significant changes  within the parent company, Justin.tv, Inc. After three years of operating  as an offshoot of Justin.tv, Twitch took over as the primary brand and the  company rebranded to Twitch Interactive in 2014, signaling a shift in fo -  cus and resources towards Twitch as their primary offering. Twitch contin -  ued to flourish, captivating millions with gameplay streams and transform -  ing gamers into online celebrities.  Not long after, the Twitch team announced that they would delete  all of Justin.tv’s archived content, which marked the true beginning of the  end for Justin.tv. Around this time, rumors began circulating that Google  and YouTube were both interested in acquiring Twitch. Finally, on August 3  5, 2014, Justin.tv’s co-founders announced that they were shutting down  their original platform for good.  Less than a month later, Amazon announced that it had acquired  Twitch for a jaw-dropping $970 million. It’s estimated that each of the  four Twitch founders owned around 12.5% of Twitch at the time it sold.  That means Justin’s pre-tax cut would have been around $120 million.  After cashing out of Twitch, Justin went on to found multiple other  successful ventures including Socialcam, a video sharing app that was  acquired for a remarkable $60 million just a year after launch.  Today, Justin can be found pouring his millions into what he be -  lieves is the next big thing; Web 3 Gaming.  1 Lesson For You: “First they ignore you, then  they laugh at you, then they fight you, then you  win.”  - Mahatma Gandhi`;
