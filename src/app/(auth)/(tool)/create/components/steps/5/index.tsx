"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import StepContainer from "../step-container";
import {Slider} from "@/components/ui/slider";
import {collection, addDoc, setDoc, getDoc, doc} from "firebase/firestore";

import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import SlideSelector from "./slide-selector";
import {usePresentationCreate} from "@/context/presentation-create-context";
import {set} from "zod";

export const Step5 = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const [progress, setProgress] = useState(0);
  const {setIsGenerating, generatingComplete} = usePresentationCreate()!;

  useEffect(() => {
    const interval = setInterval(() => {
      if (generatingComplete) {
        setProgress(100);
        clearInterval(interval);
      }
      setProgress((prev) => (prev + 1) % 100);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{opacity: 0, transform: "translateY(200px)"}}
      animate={{opacity: 1, transform: "translate(0px)"}}
      exit={{opacity: 0}}
      transition={{duration: 0.3, delay: 0.3}}
      className=" h-fit  absolute ha-[calc(100vh-60px)] pt-10"
    >
      <div className="flex flex-col gap-8  items-center h-fit ">
        <div className="w-[300px]   aspect-video relative">
          <Slide index={1} />
        </div>
        <h1 className="text-3xl poppins-bold flex items-center gap-2">
          Performing AI magic
        </h1>
        <div className="w-[400px] bg-muted h-1 relative overflow-hidden rounded-full">
          <div
            style={{width: `${progress}%`}}
            className="bg-primary left-0 h-full absolute rounded-full"
          ></div>
        </div>
        <h2 className="text-muted-foreground">This may take a few minutes</h2>
        {/* <Button onClick={() => setIsGenerating(false)} variant={"ghost"}>
          <Icons.close className="w-6 h-6" />
          cancel
        </Button> */}
      </div>
    </motion.div>
  );
};

const Slide = ({index}: {index: number}) => {
  const calcYtranslate = (index: number) => {
    if (index === 1) return -200;
    if (index === 2) return -90;
    if (index === 3) return 20;
    if (index === 4) return 130;
    if (index === 5) return 240;
    if (index === 6) return 350;
  };

  return (
    <motion.div
      // initial={{transform: "translateX(0)", scale: 1}}
      // animate={{
      //   transform: `scale(.2) translateX(-310%) translateY(${calcYtranslate(
      //     index
      //   )}%)  `,
      // }}
      // transition={{
      //   duration: 1,
      //   ease: "linear",
      //   delay: index * 5,
      //   loop: Infinity,
      // }}
      className="w-[300px] aspect-video bg-background border shadow-lg rounded-lg p-4 flex-col gap-4 flex absolute"
      // style={{left: `${index * 10}px`, top: `${index * 10}px`}}
    >
      <div className="h-8 w-[70%] rounded-full animate-pulse bg-primary/50 shadow-lg "></div>
      <div className="h-3 w-[100%] rounded-full animate-pulse bg-primary/50 shadow-lg "></div>
      <div className="h-3 w-[100%] rounded-full animate-pulse bg-primary/50 shadow-lg "></div>
      <div className="h-3 w-[100%] rounded-full animate-pulse bg-primary/50 shadow-lg "></div>
      <div className="h-3 w-[100%] rounded-full animate-pulse bg-primary/50 shadow-lg "></div>
    </motion.div>
  );
};
