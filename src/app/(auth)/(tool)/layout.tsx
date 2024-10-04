"use client";
import React from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import RegisterForm from "@/components/register";

const MainLayout = ({children}: {children: React.ReactNode}) => {
  const {currentUser} = useAuth()!;

  if (!currentUser)
    return (
      <div className=" items-center justify-center w-screen h-screen flex ">
        <div className="w-fit ">
          <RegisterForm />
        </div>
      </div>
    );

  return <>{children}</>;
};

export default MainLayout;
