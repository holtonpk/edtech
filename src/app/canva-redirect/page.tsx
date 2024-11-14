"use client";

import {useEffect} from "react";

const CanvaRedirect = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && window.opener) {
      console.log("Posting code to opener:", code); // Debugging: confirm this line runs
      console.log("Origin:", window.location.origin); // Debugging: confirm the origin is correct
      window.opener.postMessage({code}, "http://localhost:3000/presentation/1");
      // window.close(); // Close the popup
    }
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>Please wait while we complete the authorization process.</p>
    </div>
  );
};

export default CanvaRedirect;
