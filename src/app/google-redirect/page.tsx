"use client";

import {useEffect} from "react";
import {Icons} from "@/components/icons";

const GoogleRedirect = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");

    if (token && window.opener) {
      window.opener.postMessage({token});
      // window.close(); // Close the popup
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center ">
      <div className="flex gap-4 items-center">
        <Icons.logo className="w-12 h-12 " />
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-primary animate-pulse rounded-full "></span>
          <span className="h-2 w-2 bg-primary animate-pulse rounded-full delay-[.2]"></span>
          <span className="h-2 w-2 bg-primary animate-pulse rounded-full delay-[.4]"></span>
          <span className="h-2 w-2 bg-primary animate-pulse rounded-full delay-[.6]"></span>
        </div>
        <Icons.google className="w-12 h-12 text-primary" />
      </div>
      <p className="poppins-regular">
        Please wait while we complete the authorization process.
      </p>
    </div>
  );
};

export default GoogleRedirect;
