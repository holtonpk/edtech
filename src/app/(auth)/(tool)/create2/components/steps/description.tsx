import React from "react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {usePresentation} from "@/context/presentation-create-context";
import {motion} from "framer-motion";
import StepContainer from "./step-container";
import NavigationButtons from "../navigation-buttons";
import {Input} from "@/components/ui/input";
const Description = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {description, setDescription} = usePresentation()!;

  return (
    <>
      <StepContainer
        title="Describe your vision"
        subTitle="The more information you provide, the better the results will be."
      >
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input placeholder="Title"></Input>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of your presentation. This will help us create the best presentation for you. (ex. a 5th grade science lesson on the solar system)"
          />
        </div>
      </StepContainer>
      <NavigationButtons
        step={2}
        changeStep={setStep}
        isDisabled={!description}
      />
    </>
  );
};

export default Description;
