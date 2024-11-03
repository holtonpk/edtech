"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {PresentationProvider} from "@/context/presentation-context-basic";
import {PresentationCard} from "./presentation-card";
import Background from "./background";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import ToolBar from "./toolbar/toolbar";
import {auth} from "@canva/user";

export const Presentation = () => {
  const SlideId = "DkKdB59cscUg0RSZJOJx";
  return (
    <div className="h-fit md:h-screen w-screen  flex flex-col overflow-hidden gap-2">
      <Background />
      {/* <NavBar /> */}
      <div className="h-screen w-screen overflow-hidden">
        <PresentationProvider projectId={SlideId}>
          <ToolBar />
          <div className=" h-full grid grid-flow-col p-4 max-w-[1800px]  mx-auto rounded-md overflow-hidden  max-w-screen gap-4  ">
            <div
              id="slide-area"
              className=" gap-2 w-[calc(100vw-300px)] overflow-hidden relative "
            >
              <PresentationCard presId={SlideId} />
            </div>
            <div className="flex flex-col gap-4 w-full flex-grow ">
              <div className="flex gap-4 flex-col p-4 h-fit bg-background blurBack rounded-md shadow-lg border w-full ">
                <div className="grid gap-1 ">
                  <h1 className=" poppins-bold text-xl ">Edit</h1>
                  <p>Open your presentation in your favorite app to edit</p>
                </div>
                <div className="grid  gap-4 ">
                  <SaveToGoogleSlides />
                  {/* <SaveToCanva /> */}
                  <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
                    <Icons.PowerPoint className="w-6 h-6 " />
                    Power Point
                    <Icons.chevronRight className="w-4 h-4   group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
                    <Icons.download className="w-6 h-6 text-primary" />
                    Download
                  </button>
                </div>
              </div>
              <div
                className="flex gap-4 flex-col p-[2px] h-fit bg-background rounded-md shadow-lg border w-full items-center justify-center 
            bg-gradient-to-tr from-theme-purple to-theme-green via-theme-blue
            "
              >
                <div className="h-fit w-full bg-background/90 blurBack p-4 rounded-sm flex flex-col gap-2 items-center justify-center">
                  <h1 className="text-lg poppins-bold text-center">
                    Want to create interactive presentations?
                  </h1>
                  <Button className="w-full">Join the waitlist</Button>
                </div>
              </div>
            </div>
            {/* <motion.div
            initial={{transform: "translateX(200%)"}}
            animate={{transform: "translateX(0%)"}}
            transition={{duration: 0.5, delay: 2}}
            className="flex gap-4 flex-col p-[2px] h-fit bg-background rounded-md shadow-lg border w-[300px] items-center justify-center fixed bottom-4 right-4
            bg-gradient-to-tr from-theme-purple to-theme-green via-theme-blue
            "
          >
            <div className="h-fit w-full bg-background/90 blurBack p-4 rounded-sm flex flex-col gap-2 items-center justify-center">
              <h1 className="text-lg poppins-bold text-center">
                Want to create interactive presentations?
              </h1>
              <Button className="w-full">Join the waitlist</Button>
            </div>
          </motion.div> */}
          </div>
        </PresentationProvider>
      </div>
    </div>
  );
};

export default Presentation;

// const SaveToCanva = () => {
//   const clientId = "OC-AZLz4cnziII1";
//   const redirectUri = "https://edtech-lac.vercel.app/";
//   const [error, setError] = useState(null);

//   // Helper function to generate a code verifier
//   function generateCodeVerifier() {
//     const array = new Uint32Array(56 / 2);
//     window.crypto.getRandomValues(array);
//     return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
//       ""
//     );
//   }

//   // Helper function to generate a code challenge
//   async function generateCodeChallenge(codeVerifier) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(codeVerifier);
//     const digest = await window.crypto.subtle.digest("SHA-256", data);
//     return btoa(String.fromCharCode(...new Uint8Array(digest)))
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");
//   }

//   // Function to initiate Canva authorization
//   async function redirectToCanvaAuth() {
//     try {
//       const codeVerifier = generateCodeVerifier();
//       const codeChallenge = await generateCodeChallenge(codeVerifier);

//       // Store code_verifier in sessionStorage for later use
//       sessionStorage.setItem("code_verifier", codeVerifier);

//       const authUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//         redirectUri
//       )}&scope=design:content:read%20design:content:write&code_challenge=${codeChallenge}&code_challenge_method=S256`;

//       // Redirect to Canva's OAuth page
//       const popup = window.open(authUrl, "Canva Auth", "width=600,height=700");
//     } catch (err) {
//       console.error("Error generating PKCE challenge:", err);
//       setError("Failed to initiate Canva authorization.");
//     }
//   }
//   async function openPopupForCanvaAuth() {
//     try {
//       const codeVerifier = generateCodeVerifier();
//       const codeChallenge = await generateCodeChallenge(codeVerifier);

//       // Store code_verifier in sessionStorage for later use
//       sessionStorage.setItem("code_verifier", codeVerifier);

//       const authUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//         redirectUri
//       )}&scope=design:content:read%20design:content:write&code_challenge=${codeChallenge}&code_challenge_method=S256`;

//       // Open the authorization URL in a popup window
//       const popup = window.open(authUrl, "Canva Auth", "width=600,height=700");

//       // Polling to check if the popup has been closed
//       const timer = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(timer);
//           setError("Popup closed before authorization.");
//         }
//       }, 1000);

//       // Listen for messages from the popup
//       window.addEventListener("message", async (event) => {
//         console.log("event", event);
//         if (event.origin !== window.location.origin) return; // Validate origin

//         const {code} = event.data;
//         console.log("code", code);
//         if (code) {
//           // Exchange the authorization code for an access token
//           try {
//             const response = await fetch(`/api/canva-auth?code=${code}`, {
//               method: "GET",
//             });

//             const data = await response.json();

//             if (response.ok) {
//               // Store access token in localStorage or state for API requests
//               localStorage.setItem("canva_access_token", data.access_token);
//               popup.close(); // Close the popup after successful authorization
//             } else {
//               throw new Error(data.error || "Failed to get access token.");
//             }
//           } catch (err) {
//             console.error("Error exchanging code for token:", err);
//             setError("Failed to complete Canva authorization.");
//           } finally {
//             clearInterval(timer);
//           }
//         }
//       });
//     } catch (err) {
//       console.error("Error generating PKCE challenge:", err);
//       setError("Failed to initiate Canva authorization.");
//     }
//   }

//   // Function to handle the redirect back from Canva
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     if (code) {
//       // Exchange the authorization code for an access token
//       async function exchangeCodeForToken() {
//         try {
//           const codeVerifier = sessionStorage.getItem("code_verifier");

//           if (!codeVerifier) {
//             throw new Error("Code verifier not found.");
//           }

//           const response = await fetch(`/api/canva-auth?code=${code}`, {
//             method: "GET",
//           });

//           const data = await response.json();

//           if (response.ok) {
//             // Store access token in localStorage or state for API requests
//             localStorage.setItem("canva_access_token", data.access_token);
//           } else {
//             throw new Error(data.error || "Failed to get access token.");
//           }
//         } catch (err) {
//           console.error("Error exchanging code for token:", err);
//           setError("Failed to complete Canva authorization.");
//         }
//       }

//       exchangeCodeForToken();
//     }
//   }, []);

//   // const SaveToCanva = async() => {
//   //     const accessToken =
//   //     const response = await fetch("https://api.canva.com/v1/files/upload", {
//   //         method: "POST",
//   //         headers: {
//   //           Authorization: `Bearer ${accessToken}`,
//   //           "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   //         },
//   //         body: YOUR_PPTX_FILE, // Obtain this file from your app's file system or state
//   //       });

//   // }

//   return (
//     <div>
//       <button
//         onClick={openPopupForCanvaAuth}
//         className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
//       >
//         <Icons.Canva className="w-6 h-6 " />
//         Canva
//         <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

const SaveToGoogleSlides = () => {
  return (
    <button className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group">
      <Icons.GoogleSlides className="w-6 h-6" />
      Google Slides
      <Icons.chevronRight className="w-4 h-4   group-hover:translate-x-1 transition-transform duration-300" />
    </button>
  );
};
