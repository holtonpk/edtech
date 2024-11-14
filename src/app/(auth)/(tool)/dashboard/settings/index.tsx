"use client";
import React, {useState} from "react";
import {Icons} from "@/components/icons";
import {NavBar} from "../navbar";
import UserSettings from "./user-settings";

import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";

const Settings = () => {
  return (
    <>
      <div className="w-full flex gap-8 justify-between ">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icons.settingsIcon className="w-4 h-4 " />
          <h1 className=" text-xl poppins-semibold  "> Settings</h1>
        </div>
        <LogoutDialog />
      </div>
      <div className="flex flex-col gap-8 w-full  relative z-30">
        <UserSettings />
      </div>
    </>
  );
};

export default Settings;

const LogoutDialog = () => {
  const router = useRouter();

  const {logOut} = useAuth()!;

  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = async () => {
    await logOut();
    setOpenLogout(false);
    router.push("/#");
  };

  return (
    <Dialog open={openLogout} onOpenChange={setOpenLogout}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="px-16">
          Log out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout of your account?</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout of your account?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="mt-2 md:mt-0" type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
