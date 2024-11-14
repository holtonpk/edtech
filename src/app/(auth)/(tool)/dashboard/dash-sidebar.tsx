"use client";
import React, {useState} from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  FileText,
  ChevronsLeft,
} from "lucide-react";
import {Icons} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {motion, AnimatePresence} from "framer-motion";
import {useAuth} from "@/context/user-auth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

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

export function DashSidebar() {
  const items = [
    {
      title: "Presentations",
      url: "/dashboard#presentations",
      icon: Icons.presIcon,
    },
    {
      title: "Uploads",
      url: "/dashboard#uploads",
      icon: FileText,
    },

    {
      title: "Settings",
      url: "/dashboard#settings",
      icon: Settings,
    },
  ];

  const {open} = useSidebar();
  const {currentUser, logOut, setShowLoginModal} = useAuth()!;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {open ? (
          <motion.div
            animate={{opacity: 1}}
            initial={{opacity: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="flex gap-1  justify-center items-center  w-full  mt-1  "
          >
            <Icons.logo className="w-[24px] h-[24px] text-primary" />
            <h1 className="font-bold flex items-center text-black gap-[2px] mt-[2px] text-2xl poppins-bold group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 opacity-100 transition-opacity duration-300">
              Frizzle
              <span className="text-primary">.AI</span>
            </h1>
          </motion.div>
        ) : (
          <div className="flex gap-1 items-center justify-center w-full pl-1 mt-1 h-[28px] ">
            <Icons.logo className="w-[22px] h-[22px] text-primary" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!currentUser && open && (
          <motion.div
            animate={{opacity: 1}}
            initial={{opacity: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="h-fit w-[90%] mx-auto  rounded-lg  flex flex-col gap-4 p-4 bg-card border-border border"
          >
            <p className="text-sm text-center  poppins-regular">
              Create an account to access the full power of Frizzle. Don&apos;t
              worry it&apos;s free!
            </p>

            <Button
              onClick={() => {
                setShowLoginModal(true);
              }}
              className="text-sm w-full "
            >
              Create account
            </Button>
          </motion.div>
        )}
      </SidebarContent>
      {currentUser && currentUser?.uid && (
        <SidebarFooter>
          <UserInfo />
        </SidebarFooter>
      )}
      <SidebarRail>
        <motion.div
          animate={
            open
              ? {
                  // top: "24px",

                  transform: "translate(-50%, -50%) rotate(0deg)",
                }
              : {
                  // top: "50%",

                  transform: "translate(-50%, -50%) rotate(180deg)",
                }
          }
          transition={{duration: 0.5}}
          className="bg-background p-1 rounded-full absolute left-1/2  border top-1/2 z-30 shadow-sm"
        >
          <ChevronsLeft className="h-3 w-3" />
        </motion.div>
      </SidebarRail>
    </Sidebar>
  );
}

export const UserInfo = () => {
  const {open} = useSidebar();
  const {currentUser, logOut, setShowLoginModal} = useAuth()!;

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {currentUser && currentUser?.uid && (
        <div className="flex flex-col gap-4 items-center s  relative ">
          <AnimatePresence>
            {open ? (
              <motion.div
                animate={{opacity: 1}}
                initial={{opacity: 0}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
                className="w-full h-fit"
              >
                <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                  <DropdownMenuTrigger asChild>
                    {/* {currentUser.displayName} */}

                    <Button
                      // href={"/settings"}
                      variant={"ghost"}
                      className="grid grid-cols-[36px_1fr] gap-2 w-full items-center  group p-2  h-fit hover:bg-background fade-in overflow-hidden"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={currentUser?.photoURL}
                          alt={currentUser.displayName || "User"}
                        />
                        <AvatarFallback>
                          {currentUser?.firstName?.charAt(0).toUpperCase() +
                            currentUser?.lastName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-start cursor-pointer w-full  overflow-hidden">
                        <p className="text-[12px] poppins-bold  group-hover:opacity-70 capitalize">
                          {currentUser?.displayName || "User"}
                        </p>
                        <p className="text-muted-foreground text-[12px] group-hover:opacity-70 max-w-full overflow-hidden text-ellipsis">
                          {currentUser?.email || ""}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className=" w-[100px]">
                    <DropdownMenuLabel>Your Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem>
            <Link href="/settings">Notifications</Link>
          </DropdownMenuItem> */}
                    <DropdownMenuItem className="hover:bg-destructive/30">
                      <LogoutDialog setOpenMenu={setOpenMenu} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={currentUser?.photoURL}
                  alt={currentUser.displayName || "User"}
                />
                <AvatarFallback>
                  {currentUser?.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

const LogoutDialog = ({
  setOpenMenu,
}: {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const {logOut} = useAuth()!;

  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = async () => {
    await logOut();
    setOpenMenu(false);
  };

  return (
    <button onClick={handleLogout} className=" text-destructive">
      Logout
    </button>
  );
};
