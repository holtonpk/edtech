// pages/canva-redirect.js
"use client";
import {useEffect} from "react";
import {useRouter} from "next/router";

const CanvaRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const {code, error} = router.query;

    if (error) {
      console.error("Authorization Error:", error);
      // Handle the error as needed, maybe redirect to the main page with an error message
    }

    if (code) {
      // Store the code verifier from session storage
      const codeVerifier = sessionStorage.getItem("code_verifier");

      // Exchange the code for an access token
      const exchangeCodeForToken = async () => {
        const response = await fetch(
          `/api/canva-auth?code=${code}&code_verifier=${codeVerifier}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Store the access token in localStorage or state for API requests
          localStorage.setItem("canva_access_token", data.access_token);
          router.push("/"); // Redirect to home or wherever you want
        } else {
          console.error("Error exchanging code for token:", data.error);
        }
      };

      exchangeCodeForToken();
    }
  }, [router]);

  return <div>Loading...</div>; // Show loading while processing
};

export default CanvaRedirect;
