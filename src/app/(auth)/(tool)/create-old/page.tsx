import React from "react";
import {CreatePresentationForm} from "./components/create-presentation";
import {PresentationProvider} from "@/context/presentation-create-context";

const CreatePage = () => {
  return (
    <PresentationProvider>
      <CreatePresentationForm />
    </PresentationProvider>
  );
};

export default CreatePage;
