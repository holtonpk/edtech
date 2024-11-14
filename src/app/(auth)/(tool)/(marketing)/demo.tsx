"use client";
import {useRef, useState, useEffect} from "react";
import {motion} from "framer-motion";
import step1 from "./steps/1.png";
import {useInView} from "framer-motion";

export const Demo = () => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Stop observing after the first trigger if only want once
        }
      },
      {threshold: 0.5}
    );

    const cardContainer = document.getElementById("card-container");
    if (cardContainer) observer.observe(cardContainer);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-fit w-screen relative z-40 justify-center flex flex-col container gap-10 mt-10 ">
      <div className=" flex gap-2 flex-col text-center items-center  w-[650px] mx-auto">
        <h1 className="text-3xl poppins-bold ">How To Use Frizzle AI</h1>
        <p className="poppins-regular ">
          A process so simple, anyone can do it. Just upload your content,
          describe what you want, and let Frizzle AI do the rest.
        </p>
      </div>
      <div className="w-full flex flex-col gap-8 rounded-md  px-40">
        <Card
          stepNumber={1}
          title="Import"
          heading="Import your content with 1 click"
          description="Frizzle AI can transform any material—articles, videos, notes—into a presentation. Simply upload your content, and Frizzle AI takes it from there."
          imgSrc={"/steps/1.png"}
        />
        <Card
          stepNumber={2}
          title="Format"
          heading="Choose from a variety of formats"
          description="Select from a range of formats. Frizzle AI will automatically format your slides to fit your chosen style."
          imgSrc={"/steps/2.png"}
          reverse
        />

        <Card
          stepNumber={3}
          title="Generate"
          heading="Generate and export your ready presentation."
          description="Once your slides are generated, seamlessly export them to Canva, Google Slides, or PowerPoint."
          imgSrc={"/steps/3.png"}
        />
      </div>
    </div>
  );
};

const Card = ({
  stepNumber,
  title,
  heading,
  description,
  imgSrc,
  reverse,
}: {
  stepNumber: number;
  title: string;
  heading: string;
  description: string;
  imgSrc: string;
  reverse?: boolean;
}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Stop observing after the first trigger if only want once
        }
      },
      {threshold: 0.5}
    );

    const cardContainer = document.getElementById(
      `card-container-${stepNumber}`
    );
    if (cardContainer) observer.observe(cardContainer);

    return () => observer.disconnect();
  }, []);

  return (
    <div id={`card-container-${stepNumber}`} className="w-fit h-[400px] ">
      <motion.div
        initial={{transform: "translateY(500px)"}}
        animate={isInView ? {transform: "translate(0)"} : {}}
        className={`grid grid-cols-2 gap-20 items-center border p-8 rounded-md shadow-xl bg-background ${
          reverse ? "" : ""
        }`}
      >
        <div
          className={`flex gap-2 flex-col text-left  h-[200px]
          ${reverse ? "order-3" : "order-1"}
          `}
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/20 rounded-full text-primary flex items-center justify-center">
              {stepNumber}
            </div>
            <h1 className="text-primary poppins-bold text-xl">{title}</h1>
          </div>
          <h1 className="text-3xl poppins-bold">{heading}</h1>
          <p className="poppins-regular">{description}</p>
        </div>
        <div className="h-full w-full order-2 flex flex-col gap-4">
          <div className="h-[300px]  aspect-square  bg-background shadow-lg rounded-md border overflow-hidden">
            <img src={imgSrc} className="object-cover  w-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
