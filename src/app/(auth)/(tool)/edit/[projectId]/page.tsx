import React from "react";
import Editor from "./editor";
import ToolBar from "./toolbar/toolbar";
import {PresentationProvider} from "@/context/presentation-context";
import Background from "./background";

const EditPage = ({params}: {params: {projectId: string}}) => {
  return (
    <PresentationProvider projectId={params.projectId}>
      <div className="h-screen  flex flex-col  gap-2">
        <Background />

        <ToolBar />
        <Editor />
      </div>
    </PresentationProvider>
  );
};

export default EditPage;
