"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Button} from "@/components/ui/button";
import {usePresentationCreate} from "@/context/presentation-create-context";
import {ProgressBar} from "../1/index";
import {UnformattedResponse, FullSlideData} from "@/config/data";
import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import {Step5} from "../5";
import {MAX_UNSUB_GENERATIONS} from "@/config/data";

export const Step4 = () => {
  const {
    inputFiles,
    setInputFiles,
    files,
    uploadText,
    handleCancel,
    processFiles,
    isProcessing,
    description,
    selectedFormat,
    setStep,
    step,
    isGenerating,
    setIsGenerating,
    GenerateAiPresentation,
    setPrevStep,
    prevStep,
    setGeneratingComplete,
  } = usePresentationCreate()!;

  useEffect(() => {
    setPrevStep(3);
  }, []);

  const {
    currentUser,
    unSubscribedUserId,
    createUserStorage,
    userPresentations,
    setShowLoginModal,
  } = useAuth()!;

  type UnformattedTextBox = {
    text: string;
  };

  const formatSlides = (unformattedResponse: UnformattedResponse) => {
    console.log("unformatted response", JSON.stringify(unformattedResponse));
    const formatSlideTitlePage = () => {
      const title = `<p><b>${unformattedResponse.titleSlide.title}</b></p>`;
      const titleSize = calculateSizeTitle(title);
      const titlePosition = {
        x: 500 - titleSize.width / 2,
        y: 230 - titleSize.height / 2,
      };

      const description = `<p>${unformattedResponse.titleSlide.description}</p>`;
      const descriptionSize = calculateSize(description, 1);
      const descriptionPosition = {
        x: 500 - descriptionSize.width / 2,
        y: titlePosition.y + titleSize.height + 5,
      };

      return {
        background: "#ffffff",
        backgroundImage: {
          path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/pzxzor?alt=media&token=86e9acac-3e5f-4f06-b955-806c9be6e32d",
          title:
            "Lavender Blue Wavy Shape Basic Gradient Desktop Wallpaper.png",
          id: "1",
        },
        id: Math.random().toString(36).substr(2, 9),
        images: [],
        textBoxes: [
          {
            text: title,
            position: titlePosition,
            size: {width: titleSize.width},
            fontSize: 50,
            textBoxId: Math.random().toString(36).substr(2, 9),
            rotation: 0,
            textAlign: "center",
          },
          {
            text: description,
            position: descriptionPosition,
            size: {width: descriptionSize.width},
            fontSize: 20,
            textBoxId: Math.random().toString(36).substr(2, 9),
            rotation: 0,
            textAlign: "center",
          },
        ],
        shapes: [],
      };
    };

    const formattedSlides = [
      formatSlideTitlePage(),
      ...unformattedResponse.slides.map((slide) => {
        let previousTextBoxSize:
          | undefined
          | {
              size: {
                width: number;
                height: number;
              };
              position: {
                x: number;
                y: number;
              };
            } = undefined;

        const formatTextBoxes = (textBoxes: UnformattedTextBox[]) => {
          const formattedTextBoxes = textBoxes.map((textBox, index) => {
            const text = formateText(textBox.text, index === 0);
            const size = calculateSize(text, index);
            let position;
            if (index === 0) {
              position = {x: 30, y: 30};
            } else {
              if (!previousTextBoxSize) return;
              position = calculatePosition(previousTextBoxSize);
            }
            const fontSize = index === 0 ? 40 : 20;
            previousTextBoxSize = {size, position};
            const textBoxId = Math.random().toString(36).substr(2, 9);
            return {
              text,
              position,
              size: {width: size.width},
              fontSize,
              textBoxId,
              rotation: 0,
            };
          });
          return formattedTextBoxes;
        };

        const formatImages = () => {
          // figure this out later
          return [];
        };

        return {
          background: "#ffffff",
          backgroundImage: {
            path: "https://firebasestorage.googleapis.com/v0/b/ai-teacher-79270.appspot.com/o/pzxzor?alt=media&token=86e9acac-3e5f-4f06-b955-806c9be6e32d",
            title:
              "Lavender Blue Wavy Shape Basic Gradient Desktop Wallpaper.png",
            id: "1",
          },
          id: Math.random().toString(36).substr(2, 9),
          images: formatImages(),
          textBoxes: formatTextBoxes(slide.textBoxes),
          shapes: [],
        };
      }),
    ];

    return formattedSlides;
  };
  const saveToFirebase = async (slideData: FullSlideData) => {
    const docRef = await addDoc(collection(db, "presentations"), slideData);
    const presentationId = docRef.id;

    // update user storage with the new presentation
    let userDoc = null;
    let userDocRef = null;
    if (currentUser) {
      userDocRef = doc(db, "users", currentUser?.uid);
      userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await createUserStorage(currentUser.uid);
      }
    } else if (unSubscribedUserId) {
      userDocRef = doc(db, "users", unSubscribedUserId);
      userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.log("creating user storage for unsubscribed user");
        await createUserStorage(unSubscribedUserId);
      }
    }

    if (userDocRef && userDoc && userDoc.exists()) {
      const userData = userDoc.data();
      const updatedPresentations = [...userData.presentations, presentationId];
      await setDoc(userDocRef, {
        ...userData,
        presentations: updatedPresentations,
      });
    }

    return presentationId;
  };

  const router = useRouter();
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);

  const Generate = async () => {
    if (!currentUser && userPresentations.length >= MAX_UNSUB_GENERATIONS) {
      setShowLoginModal(true);
      return;
    } else {
      setIsGeneratingLocal(true);
      setTimeout(() => {
        setIsGenerating(true);
        setIsGeneratingLocal(false);
      }, 700);

      const unformattedResponse = await GenerateAiPresentation();
      console.log("response:", JSON.stringify(unformattedResponse));

      const formattedSlideData = formatSlides(unformattedResponse);

      const PresentationData = {
        title: unformattedResponse.titleSlide.title,
        slideData: {slides: formattedSlideData},
        recentColors: [],
        id: Math.random().toString(),
        createdAt: serverTimestamp(),
      };

      const projectId = await saveToFirebase(PresentationData as FullSlideData);
      setGeneratingComplete(true);
      router.push(`/presentation/${projectId}`);
    }
  };

  const formateText = (text: string, isTitle: boolean) => {
    const format = isTitle ? `<p><b>${text}</b></p>` : `<p>${text}</p>`;
    return format;
  };

  const calculatePosition = (previousTextBox: {
    size: {
      height: number;
      width: number;
    };
    position: {
      x: number;
      y: number;
    };
  }) => {
    // if its the first text box, position it at the top left
    if (!previousTextBox) {
      return {x: 30, y: 30};
    } else {
      // if its not the first text box, position it below the previous text box calculate based on the previous text box size + 20px padding
      return {
        x: 30,
        y: previousTextBox.size.height + previousTextBox.position.y + 5,
      };
    }
  };

  const calculateSize = (text: string, index: number) => {
    // create a dummy div to calculate the size of the text
    const dummyDiv = document.createElement("div");
    dummyDiv.style.position = "absolute";
    dummyDiv.style.visibility = "hidden";
    dummyDiv.style.maxWidth = "940px";
    dummyDiv.style.padding = ".05in .1in .05in .1in";

    //   dummyDiv.style.width = "fit-content";s
    dummyDiv.style.height = "fit-content";
    dummyDiv.style.fontSize = index === 0 ? "40px" : "20px";
    dummyDiv.innerHTML = text;
    document.body.appendChild(dummyDiv);
    const height = dummyDiv.clientHeight;
    const width =
      dummyDiv.clientWidth + 5 > 940 ? 940 : dummyDiv.clientWidth + 5;
    document.body.removeChild(dummyDiv);
    console.log(width, height);
    return {width, height};
  };

  const calculateSizeTitle = (text: string) => {
    // create a dummy div to calculate the size of the text
    const dummyDiv = document.createElement("div");
    dummyDiv.style.position = "absolute";
    dummyDiv.style.visibility = "hidden";
    dummyDiv.style.maxWidth = "940px";
    dummyDiv.style.padding = ".05in .1in .05in .1in";
    dummyDiv.style.textAlign = "center";

    //   dummyDiv.style.width = "fit-content";s
    dummyDiv.style.height = "fit-content";
    dummyDiv.style.fontSize = "50px";
    dummyDiv.innerHTML = text;
    document.body.appendChild(dummyDiv);
    const height = dummyDiv.clientHeight;
    const width =
      dummyDiv.clientWidth + 5 > 940 ? 940 : dummyDiv.clientWidth + 5;
    document.body.removeChild(dummyDiv);
    console.log(width, height);
    return {width, height};
  };

  return (
    <>
      <AnimatePresence>
        {!isGenerating && (
          <motion.div
            exit={
              step > 3
                ? {opacity: 0, transform: "translateX(-200px)"}
                : {opacity: 0, transform: "translateX(200px)"}
            }
            animate={{opacity: 1, transform: "translate(0px)"}}
            initial={
              prevStep === 0
                ? {opacity: 1, transform: "translateY(200px)"}
                : prevStep > 3
                ? {opacity: 1, transform: "translateX(-200px)"}
                : {opacity: 1, transform: "translateX(200px)"}
            }
            transition={{duration: 0.3}}
            className="w-full h-[450px] absolute rounded-md overflow-hidden  "
          >
            <div className="w-full h-[450px] overflow-scroll pb-6  flex-col gap-4 flex  p-6 pt-2  absolute  rounded-md ">
              <CreatePreview
                Generate={Generate}
                isGeneratingLocal={isGeneratingLocal}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{isGenerating && <Step5 />}</AnimatePresence>
    </>
  );
};

const CreatePreview = ({
  Generate,
  isGeneratingLocal,
}: {
  Generate: () => void;
  isGeneratingLocal: boolean;
}) => {
  const {files, handleCancel, selectedFormat, setStep, step} =
    usePresentationCreate()!;

  return (
    <div className="w-full h-fit  flex flex-col gap-4 ">
      <h1 className="poppins-bold text-center text-xl">
        Let&apos;s review before you generate
      </h1>
      <div className="w-full p-4 rounded-md flex flex-col gap-4 bg-background h-fit   border relative">
        <div className="grid gap-1">
          <h1 className="poppins-bold  ">You Uploaded</h1>
          <div className="grid grid-cols-1">
            {files &&
              files.map((file, index) => (
                <ProgressBar
                  key={index}
                  fileLocal={file}
                  onCancel={handleCancel}
                  index={index}
                />
              ))}
          </div>
        </div>
        {/* <div className="grid gap-1">
          <h1 className="poppins-bold">You described the project as</h1>
          <div className="border p-2 rounded-sm bg-background">
            {description}
          </div>
        </div> */}
        <div className="grid gap-1">
          <h1 className="poppins-bold  ">You would like it formatted as </h1>
          <div className="border p-2 px-4 rounded-sm bg-background">
            {selectedFormat == "less-words" && (
              <>
                <h1 className="font-bold  "> Less Words</h1>
                <p className=" text-muted-foreground text-sm ">
                  Slides will have less words and more images, this is great for
                  visual learners
                </p>
              </>
            )}
            {selectedFormat == "more-words" && (
              <>
                <h1 className="font-bold  "> More Words</h1>
                <p className=" text-muted-foreground text-sm ">
                  Slides will have more words and less images, this is great for
                  including more detail
                </p>
              </>
            )}
            {selectedFormat == "bullet-points" && (
              <>
                <h1 className="font-bold  "> Bullet points</h1>
                <p className=" text-muted-foreground text-sm ">
                  Slides will have bullet points, this is great for summarizing
                </p>
              </>
            )}
            {selectedFormat == "mixed" && (
              <>
                <h1 className="font-bold  "> Mixed</h1>
                <p className=" text-muted-foreground text-sm ">
                  Slides will be a mix of less words, more words and bullet
                  points
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center w-full">
        <Button
          onClick={Generate}
          className="flex items-center w-fit px-[150px] gap-1 text-xl poppins-bold py-6"
        >
          {isGeneratingLocal ? (
            <Icons.spinner className="w-6 h-6 animate-spin" />
          ) : (
            <Icons.sparkles className="w-6 h-6" />
          )}
          Generate
        </Button>
        <Button
          onClick={() => setStep(step - 1)}
          variant={"ghost"}
          className="flex items-center mt-2"
        >
          <Icons.chevronLeft className="w-6 h-6" />
          Prev step
        </Button>
      </div>
    </div>
  );
};

const unformattedResponse2 = {
  slides: [
    {
      textBoxes: [
        {text: "Overview of the American Civil War (1861-1865)"},
        {
          text: "Conflict between the Northern states (Union) and the secessionist Southern states (Confederacy).",
        },
        {
          text: "Major catalyst for war: differences over slavery, economic disparities, and states' rights.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Causes of the Civil War"},
        {
          text: "Economic Differences: Industrial North vs. Agricultural South reliant on slave labor.",
        },
        {
          text: "Slavery: Central moral and economic issue dividing the nation.",
        },
        {
          text: "States' Rights: Tensions over federal vs. state authority.",
        },
        {
          text: "Key Legislation: Missouri Compromise, Compromise of 1850, and Kansas-Nebraska Act.",
        },
        {
          text: "Dred Scott Decision: Ruled African Americans could not be U.S. citizens, heightening tensions.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Major Battles and Campaigns"},
        {
          text: "First Battle of Bull Run: Indicated a long and costly conflict ahead.",
        },
        {
          text: "Battle of Gettysburg: Union victory that marked a turning point in the war.",
        },
        {
          text: "Siege of Vicksburg: Gave Union control of the Mississippi River, splitting the Confederacy.",
        },
        {
          text: "Sherman's March to the Sea: Demonstrated the North's total war strategy.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Important Figures of the Civil War"},
        {
          text: "Abraham Lincoln: Union President, led the nation during the war.",
        },
        {text: "Jefferson Davis: President of the Confederate States."},
        {
          text: "Ulysses S. Grant: Key Union general, later U.S. President.",
        },
        {text: "Robert E. Lee: Distinguished Confederate general."},
      ],
    },
    {
      textBoxes: [
        {text: "Emancipation Proclamation (1863)"},
        {
          text: "Declared by President Lincoln, freeing slaves in Confederate-held areas.",
        },
        {
          text: "Shifted the war's focus to slavery, allowing recruitment of African American soldiers.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "End of the War and Reconstruction"},
        {
          text: "Lee's surrender at Appomattox Court House (1865) marked the war's end.",
        },
        {
          text: "Reconstruction: Focused on rebuilding the South and integrating freed slaves.",
        },
        {
          text: "Crucial Amendments: 13th (abolition of slavery), 14th (citizenship rights), and 15th (voting rights).",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Study Tips for Understanding the Civil War"},
        {
          text: "Review key dates and events to understand their sequence and impact.",
        },
        {
          text: "Learn about key figures and their contributions to the war's outcomes.",
        },
        {
          text: "Utilize flashcards for memorizing important terms and definitions.",
        },
        {
          text: "Practice with timelines to visualize the chronological order of events.",
        },
      ],
    },
    {
      textBoxes: [
        {text: "Sample Questions"},
        {
          text: "What were the main economic differences between the North and the South?",
        },
        {
          text: "Explain the significance of the Emancipation Proclamation.",
        },
        {
          text: "Describe the effects of the American Civil War on the southern states.",
        },
      ],
    },
  ],
};
