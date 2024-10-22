import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {DashSidebar} from "./dash-sidebar";
import Background from "@/components/background";
import {Icons} from "@/components/icons";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <DashSidebar />
      <main>
        {/* <SidebarTrigger className=" "></SidebarTrigger> */}
        {children}
      </main>
      <Background />
    </SidebarProvider>
  );
}
