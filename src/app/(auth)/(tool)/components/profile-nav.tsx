"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/context/user-auth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import Link from "next/link";

const ProfileNav = () => {
  const {currentUser, logOut} = useAuth()!;

  if (!currentUser) return null;

  return (
    <div className=" gap-2 items-center text-primary md:ml-auto hidden md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger className="text-md">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={currentUser?.photoURL}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {currentUser?.firstName?.charAt(0).toUpperCase() +
                currentUser?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* {currentUser.displayName} */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-[100px]">
          <DropdownMenuLabel>Your Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/settings">Notifications</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-destructive/30">
            <button onClick={logOut} className=" text-destructive">
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileNav;
