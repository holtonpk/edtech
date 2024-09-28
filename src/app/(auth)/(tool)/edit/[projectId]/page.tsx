import React from "react";
import Editor from "./editor";
import ToolBar from "./toolbar/toolbar";
import {PresentationProvider} from "@/context/presentation-context";

const EditPage = ({params}: {params: {projectId: string}}) => {
  return (
    <PresentationProvider projectId={params.projectId}>
      <div className="h-screen flex flex-col p-2 gap-2">
        <ToolBar />
        <Editor />
      </div>
    </PresentationProvider>
  );
};

export default EditPage;
