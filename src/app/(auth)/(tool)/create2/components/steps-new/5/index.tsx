"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";
import {Slider} from "@/components/ui/slider";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";
import {Slide, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import SlideSelector from "./slide-selector";
import {PresentationProvider} from "@/context/presentation-context-basic";

export const Step5 = ({
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
    setPrevStep(5);
  }, []);

  const SlideId = "DkKdB59cscUg0RSZJOJx";
  return (
    <motion.div className=" h-full flex flex-col items-center p-4 rounded-md  w-full gap-4  ">
      <PresentationProvider projectId={SlideId}>
        {/* <div className="gap-4 grid grid-cols-2 h-fit   w-[600px]">
          <Button
            variant={"outline"}
            className="bg-primary text-white w-full hover:bg-primary/90 hover:text-white"
          >
            <Icons.play className="h-3 w-3 mr-3" />
            Present
          </Button>
          <Button variant={"outline"} className="w-full">
            <Icons.upload className="w-4 h-4 mr-3" />
            Share
          </Button>
        </div> */}
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="rounded-full aspect-square h-fit w-fit p-2"
          >
            <Icons.chevronLeft className="w-6 h-6" />
          </Button>
          <PresentationCard presId={SlideId} />
          <Button
            variant={"outline"}
            className="rounded-full aspect-square h-fit w-fit p-2"
          >
            <Icons.chevronRight className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-col p-2 h-fit bg-background/50 blurBack rounded-md shadow-lg border w-[600px] ">
            {/* <div className="grid gap-1">
          <h1 className=" poppins-bold text-xl ">Open in </h1>
              <p>Open your presentation in your favorite app to edit</p>
            </div> */}
            <div className="grid grid-cols-3 gap-4">
              <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
                <Icons.GoogleSlides className="w-6 h-6" />
                Google Slides
                <Icons.chevronRight className="w-4 h-4   group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
                <Icons.Canva className="w-6 h-6 " />
                Canva
                <Icons.chevronRight className="w-4 h-4   group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
                <Icons.PowerPoint className="w-6 h-6 " />
                Power Point
                <Icons.chevronRight className="w-4 h-4   group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div
            className="flex gap-4 flex-col p-[2px] h-fit bg-background rounded-md shadow-lg border w-[300px] items-center justify-center fixed bottom-4 right-4
          bg-gradient-to-tr from-theme-purple to-theme-green via-theme-blue
          "
          >
            <div className="h-fit w-full bg-background/90 blurBack p-4 rounded-sm flex flex-col gap-2 items-center justify-center">
              <h1 className="text-lg poppins-bold text-center">
                Want to create interactive presentations?
              </h1>
              <Button className="w-full">Join the waitlist</Button>
            </div>
          </div>
        </div>
      </PresentationProvider>
    </motion.div>
  );
};

const PresentationCard = ({presId}: {presId: string}) => {
  const [title, setTitle] = useState<string | undefined>(undefined);

  const [slide, setSlide] = useState<Slide | undefined>(undefined);

  const dataIsFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "presentations", presId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSlide(docSnap.data().slideData.slides[0]);
        setTitle(docSnap.data().title);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    if (!dataIsFetched.current) {
      fetchData();
      dataIsFetched.current = true;
    }
  }, [presId]);

  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [thumbScale, setThumbScale] = useState<number | undefined>(undefined);

  const setScale = () => {
    const selectorContainer = selectorContainerRef.current;
    if (!selectorContainer) return;
    const calculateScale = selectorContainer.clientWidth / 1000;
    setThumbScale(calculateScale);
  };
  React.useEffect(() => {
    window.addEventListener("resize", setScale);
    return () => {
      window.removeEventListener("resize", setScale);
    };
  }, []);

  React.useEffect(() => {
    setScale();
  }, [slide]);

  const router = useRouter();

  return (
    <div className="w-[800px] h-fit gap-4  ">
      <div className="flex flex-col  gap-2 max-w-[800px] w-full h-fit">
        {slide && (
          <div
            ref={selectorContainerRef}
            style={{
              background: slide.background,
            }}
            onClick={() => {
              router.push(`/edit/${presId}`);
            }}
            className={`rounded-lg w-full relative aspect-[16/9] overflow-hidden p-6 flex items-center justify-center bg-white text-black   duration-300  border`}
          >
            {thumbScale ? (
              <div
                className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
                style={{transform: `scale(${thumbScale})`}}
              >
                {slide &&
                slide.backgroundImage &&
                slide.backgroundImage.path !== "undefined" ? (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.backgroundImage.path})`,
                    }}
                  />
                ) : (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundColor: slide ? slide.background : "#ffffff",
                      opacity: slide?.backgroundOpacity
                        ? slide?.backgroundOpacity
                        : 1,
                    }}
                  />
                )}
                {slide.textBoxes &&
                  slide.textBoxes.map((textbox: TextBoxType, index: number) => (
                    <div
                      key={index}
                      className=" p-2 absolute pointer-events-none"
                      style={{
                        top: textbox.position.y,
                        left: textbox.position.x,
                        height: "fit-content",
                        width: textbox.size.width,
                        transform: `rotate(${textbox.rotation}deg)`,
                        fontSize: `${textbox.fontSize}px`,
                      }}
                      dangerouslySetInnerHTML={{__html: textbox.text}}
                    />
                  ))}
                {slide.images &&
                  slide.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        top: image.position.y,
                        left: image.position.x,
                        width: image.size.width,
                        transform: `rotate(${image.rotation}deg)`,
                      }}
                      className="p-2 h-fit w-fit absolute origin-center pointer-events-none"
                    >
                      <img
                        src={image.image.path}
                        alt={image.image.title}
                        className="origin-center p-2 pointer-events-none h-full w-full"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <>no scale</>
            )}
          </div>
        )}
      </div>

      {/* <div className="flex-grow h-[100px] w-[1000px] ">
        <SlideSelector shouldHideToolbar={false} />
      </div> */}
    </div>
  );
};
