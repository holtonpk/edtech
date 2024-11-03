import {PresentationProvider} from "@/context/presentation-context-basic";
import React from "react";

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <PresentationProvider projectId="BVXG0nFcE2z5ILfeezNy">
      {children}
    </PresentationProvider>
  );
};

export default Layout;
