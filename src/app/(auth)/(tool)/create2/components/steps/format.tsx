import React from "react";
import {Slider} from "@/components/ui/slider";
import {usePresentation} from "@/context/presentation-create-context";
import StepContainer from "./step-container";
import NavigationButtons from "../navigation-buttons";
const Format = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {numOfSlides, setNumOfSlides} = usePresentation()!;
  return (
    <>
      <StepContainer
        title="What will your presentation look like?"
        subTitle="We need to know some of the fine details of your presentation to create exactly what you want."
      >
        <div className="gap-10 grid ">
          <div className="grid gap-2">
            <h1 className=" text-2xl font-bold ">{numOfSlides} Slides</h1>

            <Slider
              id="question-quantity"
              min={1}
              max={10}
              value={numOfSlides}
              onValueChange={setNumOfSlides}
            />
          </div>
          <SlideFormat />
          <SlideFormat />
          <SlideFormat />
        </div>
      </StepContainer>
      <NavigationButtons step={3} changeStep={setStep} />
    </>
  );
};

export default Format;

const SlideFormat = () => {
  type Format = "less-words" | "more-words" | "bullet-points";

  const [selectedFormat, setSelectedFormat] =
    React.useState<Format>("less-words");

  return (
    <div className="grid grid-cols-3 gap-4">
      <button
        onClick={() => setSelectedFormat("less-words")}
        className={`p-2 border flex flex-col rounded-md group cursor-pointer items-center hover:border-primary transition-colors
  ${selectedFormat === "less-words" ? "border-primary" : ""}
          
          `}
      >
        <div className="border rounded-md w-full h-fit">
          <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md">
            <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
            <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            <div className="w-[75%] h-4 bg-primary/30 rounded-full"></div>
          </div>
        </div>
        <h1 className="font-bold text-center mt-2"> Less Words</h1>
        <p className="text-center text-muted-foreground text-sm mb-3">
          Slide will have less words and more images, this is great for visual
          learners
        </p>
        <div
          className={`h-5 w-5 mx-auto mt-auto rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
            ${
              selectedFormat === "less-words"
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            }
            `}
        >
          <div
            className={`group-hover:block h-2 w-2 bg-background rounded-full
   ${selectedFormat === "less-words" ? "block" : "hidden"}
              `}
          />
        </div>
      </button>
      <button
        onClick={() => setSelectedFormat("more-words")}
        className={`p-2 border flex flex-col rounded-md group cursor-pointer items-center hover:border-primary transition-colors
  ${selectedFormat === "more-words" ? "border-primary" : ""}
          
          `}
      >
        <div className="border rounded-md w-full h-fit">
          <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md">
            <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
            <div className="w- h-4 bg-primary/30 rounded-full"></div>
            <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            <div className="w-full h-4 bg-primary/30 rounded-full"></div>
          </div>
        </div>
        <h1 className="font-bold text-center mt-2"> More Words</h1>
        <p className="text-center text-muted-foreground text-sm mb-3">
          Slide will have more words and less images, this is great for auditory
          learners
        </p>
        <div
          className={`h-5 w-5 mx-auto mt-auto rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
            ${
              selectedFormat === "more-words"
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            }
            `}
        >
          <div
            className={`group-hover:block h-2 w-2 bg-background rounded-full 
   ${selectedFormat === "more-words" ? "block" : "hidden"}
              `}
          />
        </div>
      </button>
      <button
        onClick={() => setSelectedFormat("bullet-points")}
        className={`p-2 border flex flex-col  rounded-md group cursor-pointer items-center hover:border-primary transition-colors
  ${selectedFormat === "bullet-points" ? "border-primary" : ""}
          
          `}
      >
        <div className="border rounded-md w-full h-fit">
          <div className="bg-background w-full flex flex-col gap-1  aspect-[16/9] p-2 rounded-md">
            <div className="w-1/2 h-5 bg-primary/30 rounded-full"></div>
            <div className="grid grid-cols-[10px_1fr] items-center gap-1">
              <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            </div>
            <div className="grid grid-cols-[10px_1fr] items-center gap-1">
              <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            </div>
            <div className="grid grid-cols-[10px_1fr] items-center gap-1">
              <div className="h-[10px] w-[10px] bg-primary/30 rounded-full"></div>
              <div className="w-full h-4 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>

        <h1 className="font-bold text-center mt-2"> Bullet points</h1>
        <p className="text-center text-muted-foreground text-sm mb-3">
          Slide will have bullet points, this is great for summarizing
        </p>
        <div
          className={`h-5 w-5 mt-auto mx-auto  rounded-full border-2  group-hover:border-primary group-hover:bg-primary  flex items-center justify-center
            ${
              selectedFormat === "bullet-points"
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            }
            `}
        >
          <div
            className={`group-hover:block h-2 w-2 bg-background rounded-full
   ${selectedFormat === "bullet-points" ? "block" : "hidden"}
              `}
          />
        </div>
      </button>
    </div>
  );
};
