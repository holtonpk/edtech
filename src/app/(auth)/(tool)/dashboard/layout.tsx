import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {DashSidebar} from "./dash-sidebar";
import Background from "@/components/background";
import {Icons} from "@/components/icons";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Dashboard - Frizzle AI",
  image: "image/favicon.ico",
});

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
