import React from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
const StepPanel = ({
  changeStep,
  step,
}: {
  changeStep: (step: number) => void;
  step: number;
}) => {
  const steps = [
    {
      title: "About",
      description: "What do you want to create?",
    },
    {
      title: "Resources",
      description: "Resources (this could be a Study guide, textbook, paper)",
    },
    {
      title: "Format",
      description: "Choose the format of your presentation",
    },
    {
      title: "Generate",
      description: "Generate your presentation and start editing",
    },
  ];

  return (
    <div className="w-[30%] h-screen bg-background flex flex-col p-6 fixed  right-0">
      <div className="flex flex-col gap-2 md:max-w-[80%]">
        <div className="grid gap-1 mb-4 ">
          <Label className="text-2xl flex items-center ">
            <div className="h-full  p-1 rounded-sm bg-primary/30 aspect-square flex justify-center items-center mr-2">
              <Icons.todo className="w-full h-full  text-primary" />
            </div>
            Todo list
          </Label>
          <p className="text-muted-foreground whitespace-nowrap">
            Follow the steps to create your presentation
          </p>
        </div>
        {steps.map((stepObject, index) => (
          <button
            key={index}
            onClick={() => changeStep(index + 1)}
            className={`grid grid-cols-[40px_1fr] items- gap-2 transition-opacity duration-1000 cursor-pointer
          ${step < index + 1 ? "opacity-40" : "opacity-100"}
        `}
          >
            <div className="w-8  h-full relative  items-center grid grid-rows-[32px_1fr] justify-center gap-2  overflow-hidden">
              <div
                className={`flex items-center justify-center border-2 rounded-full aspect-square h-8 z-30 relative transition-colors duration-1000
               ${
                 step === index + 1
                   ? "bg-background border-primary text-primary "
                   : step > index + 1
                   ? "bg-green-500 border-green-500 text-white"
                   : "bg-transparent border-muted-foreground text-muted-foreground"
               }
              `}
              >
                <Icons.check className="w-5 h-5 " />
              </div>
              <div className=" w-[2px] mx-auto grow-to-bottom z-10 h-full bg-muted-foreground opacity-40 " />
              <div
                className={`left-1/2 -translate-x-1/2 top-[40px] w-[2px] mx-auto grow-to-bottom z-[40] absolute bg-green-500   
              ${
                steps.length === index + 1 ? "shrink-to-top" : "grow-to-bottoms"
              }

              ${step > index + 1 ? "" : "shrink-to-top"}                  
              `}
              />
            </div>

            <div
              className={`flex flex-col gap-1 text-left
            
            
            `}
            >
              <h2 className="text-lg font-bold">{stepObject.title}</h2>
              <p className="text-muted-foreground pb-4">
                {stepObject.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full mt-auto relative  shadow-lg p-4 border rounded-md">
        <div className=" flex flex-col gap-2 h-fit items-start md:max-w-[70%] ">
          <Icons.lifeBuoy className="w-6 h-6 text-muted-foreground" />
          <h1 className="font-bold">Having trouble?</h1>
          <p className="text-muted-foreground text-sm">
            Feel free to contact us and we will always help you though the
            process.
          </p>
          <Button variant={"outline"} className="w-fit">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepPanel;
