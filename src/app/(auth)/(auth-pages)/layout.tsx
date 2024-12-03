// import { AuthProvider } from "@/context/user-auth";
// import { siteConfig } from "@/config/site";
// import {constructMetadata} from "@/lib/utils";
import {Metadata} from "next";
import Image from "next/image";
import {Icons} from "@/components/icons";
import Background from "@/components/background";

interface AuthLayoutProps {
  children: React.ReactElement;
}
import Link from "next/link";

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    // <AuthProvider>

    <>
      <Link
        href="/"
        className=" items-center space-x-2 flex w-fit absolute top-4 left-4"
      >
        <div className="flex gap-2 items-center">
          <div className=" aspect-square h-fit w-fit flex items-center justify-center">
            <Icons.logo className="w-8 h-8 " />
          </div>
          <h1 className="font-bold flex items-center gap-[2px] text-2xl mt-2 poppins-bold text-black">
            Frizzle
            <span className="text-primary">.AI</span>
          </h1>
        </div>
      </Link>

      {children}
      <Background />
    </>
    // </AuthProvider>
  );
}
