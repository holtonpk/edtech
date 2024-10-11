import React from "react";
import Editor from "./editor";
import ToolBar from "./toolbar/toolbar";
import {PresentationProvider} from "@/context/presentation-context";
import Background from "./background";

const EditPage = ({params}: {params: {projectId: string}}) => {
  return (
    <PresentationProvider projectId={params.projectId}>
      <div
        id="editPage-root"
        className="h-fit md:h-screen w-screen  flex flex-col overflow-hidden gap-2"
      >
        <Background />
        <ToolBar />
        <Editor />
      </div>
    </PresentationProvider>
  );
};

export default EditPage;
