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
import crypto from "crypto";

const Presentation = ({params}: {params: {projectId: string}}) => {
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
//   const redirectUri = "https://edtech-lac.vercel.app/"; // Redirect URI registered with Canva
//   const scopes = "design:content:read design:content:write";

//   function generateCodeVerifier() {
//     const array = new Uint8Array(32);
//     window.crypto.getRandomValues(array);
//     return btoa(String.fromCharCode(...array))
//       .replace(/=/g, "")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_");
//   }

//   async function generateCodeChallenge(codeVerifier) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(codeVerifier);
//     const digest = await window.crypto.subtle.digest("SHA-256", data);
//     return btoa(String.fromCharCode(...new Uint8Array(digest)))
//       .replace(/=/g, "")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_");
//   }

//   async function saveToCanva() {
//     const codeVerifier = generateCodeVerifier();
//     const codeChallenge = await generateCodeChallenge(codeVerifier);

//     sessionStorage.setItem("code_verifier", codeVerifier); // Store code verifier for later use

//     const authUrl = `https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&scope=${encodeURIComponent(scopes)}&code_challenge=${codeChallenge}`;

//     // Open the Canva auth URL in a popup window
//     const popup = window.open(authUrl, "canvaAuth", "width=500,height=600");

//     // Listen for messages from the popup window
//     window.addEventListener("message", (event) => {
//       if (event.origin === new URL(redirectUri).origin) {
//         const {code} = event.data;

//         if (code) {
//           popup.close(); // Close popup after receiving code
//           handleTokenExchange(code); // Exchange the code for tokens
//         }
//       }
//     });
//   }

//   async function handleTokenExchange(code) {
//     const codeVerifier = sessionStorage.getItem("code_verifier");

//     const tokenResponse = await fetch("https://www.canva.com/api/oauth/token", {
//       method: "POST",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         client_id: clientId,
//         redirect_uri: redirectUri,
//         grant_type: "authorization_code",
//         code_verifier: codeVerifier,
//         code: code,
//       }),
//     });

//     const tokenData = await tokenResponse.json();
//     console.log("Access Token:", tokenData); // Handle or store access token here
//   }

//   return (
//     <button
//       onClick={saveToCanva}
//       className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
//     >
//       <Icons.Canva className="w-6 h-6 " />
//       Canva
//       <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//     </button>
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
