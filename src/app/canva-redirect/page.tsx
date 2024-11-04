"use client";

import {useEffect} from "react";

const CanvaRedirect = () => {
  useEffect(() => {
    // Extract the "code" parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && window.opener) {
      // Send the authorization code to the main window
      window.opener.postMessage({code}, window.location.origin);
      // Close the popup after sending the code
      window.close();
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
