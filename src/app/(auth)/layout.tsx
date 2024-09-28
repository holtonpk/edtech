import React from "react";
import {AuthProvider} from "@/context/user-auth";
const Layout = ({children}: {children: React.ReactNode}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Layout;
