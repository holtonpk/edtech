"use client";
import {Icons} from "@/components/icons";
import React, {
  useContext,
  useRef,
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  FullSlideData,
  Slide,
  Modes,
  AlignType,
  TextBoxType,
  Image,
  Position,
  Size,
} from "@/config/data";

import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import {useAuth} from "@/context/user-auth";
import {createNewBlankPresentation} from "@/lib/utils";
import Background from "@/components/background";
import {UserPresentations} from "@/src/app/(auth)/(tool)/dashboard/user-presentations";
import {FeaturedPresentations} from "@/src/app/(auth)/(tool)/dashboard/featured-pres";
import {useSidebar} from "@/components/ui/sidebar";

const Dashboard = () => {
  const {open} = useSidebar();

  const {currentUser} = useAuth()!;

  return (
    <div
      className={` flex flex-col transition-[width] ease-linear p-8 pt-4  gap-4
    ${open ? "w-[calc(100vw-13rem)]" : "w-[calc(100vw-3rem)]"}
    
    `}
    >
      <div className="flex w-full justify-between items-center">
        <h1 className="text-3xl poppins-bold">
          Welcome back, {currentUser?.firstName}
        </h1>
        <div className="flex w-fit gap-4 text-primary">
          <a>About</a>
          <a>Learn</a>
          <a>Share</a>
        </div>
      </div>
      <div className="w-full flex gap-8  ">
        <CreateNew />
        <button className="w-fit border rounded-md flex gap-2 p-2 items-center text-left">
          <div className="bg-primary/20 rounded-sm p-2 aspect-square w-fit h-fit flex items-center justify-center">
            <Icons.wand className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col ">
            <h1 className="text-lg font-bold">Create from upload</h1>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              Create a new presentation from an uploaded file
            </p>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-8 w-full  relative z-30">
        <FeaturedPresentations />
        <UserPresentations />
      </div>
    </div>
  );
};

export default Dashboard;

const NavBar = () => {
  return (
    <div className="h-[60px] w-full   flex items-center justify-between px-10 relative z-50">
      <div className="flex gap-2 items-center">
        <div className="bg-primary/20 rounded-[6px] p-1 aspect-square h-fit w-fit flex items-center justify-center">
          <Icons.wand className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-bold flex items-center gap-[2px] text-xl poppins-bold">
          Frizzle
          <span className="text-primary">ai</span>
        </h1>
      </div>
      <ProfileNav />
    </div>
  );
};

const CreateNewFromUpload = () => {
  return <Button>Turn uploaded into presentation</Button>;
};

const CreateNew = () => {
  const router = useRouter();
  const {currentUser} = useAuth()!;

  const [isLoading, setIsLoading] = useState(false);

  const createNew = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const projectId = await createNewBlankPresentation(currentUser);
    router.push(`/edit/${projectId}`);
    setIsLoading(false);
  };

  return (
    <button
      onClick={createNew}
      disabled={isLoading}
      className="w-fit border rounded-md hover:border-primary flex gap-2 p-2 items-center text-left "
    >
      <div className="bg-primary/20 rounded-sm p-2 aspect-square w-fit h-fit flex items-center justify-center">
        <Icons.add className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col ">
        <h1 className="text-lg font-bold">New blank presentation</h1>
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Create a new presentation from an uploaded file
        </p>
      </div>
    </button>
  );
};
