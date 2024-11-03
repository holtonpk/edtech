"use client";
import {useEffect} from "react";

const CanvaRedirect = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      window.opener.postMessage({error}, "*");
      window.close();
      return;
    }

    if (code) {
      // Send the authorization code back to the opener (main window)
      window.opener.postMessage({code}, "*");
      window.close(); // Close the popup after sending the code
    }
  }, []);

  return <div>Loading...</div>; // Show a loading state while processing
};

export default CanvaRedirect;
