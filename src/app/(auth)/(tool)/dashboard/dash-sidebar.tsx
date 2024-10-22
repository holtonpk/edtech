"use client";
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
import {Button} from "@/components/ui/button";

export function DashSidebar() {
  const items = [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
    },
    {
      title: "Uploads",
      url: "#",
      icon: FileText,
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const {open} = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 items-center w-full  ">
          <div className="bg-primary/20 rounded-[6px] p-1 aspect-square h-fit w-fit flex items-center justify-center">
            <Icons.wand className="w-5 h-5 text-primary" />
          </div>

          <h1 className="font-bold flex items-center text-black gap-[2px] text-2xl poppins-bold group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 opacity-100 transition-opacity duration-300">
            Frizzle
            <span className="text-primary">.ai</span>
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
      </SidebarContent>
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
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
  const {currentUser, logOut} = useAuth()!;

  return (
    <>
      {currentUser && currentUser?.uid ? (
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
                <DropdownMenu>
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
                      <button onClick={logOut} className=" text-destructive">
                        Logout
                      </button>
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
      ) : (
        <>
          {open && (
            <div className="flex flex-col gap-4 items-center border-b border-border  relative mt-auto" />
          )}
        </>
      )}
    </>
  );
};
