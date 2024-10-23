import React, {useEffect} from "react";
import {usePresentation} from "@/context/presentation-create-context";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import {Label} from "@/components/ui/label";
import {Icons} from "@/components/icons";
import StepContainer from "./step-container";
import NavigationButtons from "../navigation-buttons";
import {FullSlideData, UnformattedResponse} from "@/config/data";
import {useRouter} from "next/navigation";
import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";

const Generate = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const {description, uploads, numOfSlides} = usePresentation()!;
  const {GenerateAiPresentation} = usePresentation()!;
  const {currentUser} = useAuth()!;

  const [formattedSlides, setFormattedSlides] = React.useState();
  const [isGenerating, setIsGenerating] = React.useState(false);

  type UnformattedTextBox = {
    text: string;
  };

  const formatSlides = (unformattedResponse: UnformattedResponse) => {
    const formattedSlides = unformattedResponse.slides.map((slide) => {
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
            position = {x: 20, y: 20};
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
        id: Math.random().toString(36).substr(2, 9),
        images: formatImages(),
        textBoxes: formatTextBoxes(slide.textBoxes),
        shapes: [],
      };
    });

    return formattedSlides;
  };

  const saveToFirebase = async (slideData: FullSlideData) => {
    const docRef = await addDoc(collection(db, "presentations"), slideData);
    const presentationId = docRef.id;

    // update user storage with the new presentation
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser?.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedPresentations = [...userData.presentations, presentationId];
      await setDoc(userRef, {...userData, presentations: updatedPresentations});
    }

    return presentationId;
  };
  const router = useRouter();

  const Generate = async () => {
    setIsGenerating(true);

    const unformattedResponse = await GenerateAiPresentation();

    const formattedSlideData = formatSlides(unformattedResponse);

    const PresentationData = {
      title: "Test Presentation",
      slideData: {slides: formattedSlideData},
      recentColors: [],
      id: Math.random().toString(),
      createdAt: serverTimestamp(),
    };

    const projectId = await saveToFirebase(PresentationData as FullSlideData);

    router.push(`/edit/${projectId}`);

    setIsGenerating(false);
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
      return {x: 20, y: 20};
    } else {
      // if its not the first text box, position it below the previous text box calculate based on the previous text box size + 20px padding
      return {
        x: 20,
        y: previousTextBox.size.height + previousTextBox.position.y + 10,
      };
    }
  };

  const calculateSize = (text: string, index: number) => {
    // create a dummy div to calculate the size of the text
    const dummyDiv = document.createElement("div");
    dummyDiv.style.position = "absolute";
    dummyDiv.style.visibility = "hidden";
    dummyDiv.style.maxWidth = "960px";
    //   dummyDiv.style.width = "fit-content";
    dummyDiv.style.height = "fit-content";
    dummyDiv.style.fontSize = index === 0 ? "40px" : "20px";
    dummyDiv.innerHTML = text;
    document.body.appendChild(dummyDiv);
    const height = dummyDiv.clientHeight;
    const width = dummyDiv.clientWidth + 5;
    document.body.removeChild(dummyDiv);
    console.log(width, height);
    return {width, height};
  };

  return (
    <>
      <StepContainer
        title="Ready to generate"
        subTitle="Your presentation is ready to be generated. Please review the details below"
      >
        <Button className="w-full" onClick={Generate}>
          {isGenerating ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            <Icons.wand className="w-5 h-5 mr-2" />
          )}
          Generate
        </Button>
      </StepContainer>
      <NavigationButtons step={4} changeStep={setStep} />
    </>
  );
};

export default Generate;
