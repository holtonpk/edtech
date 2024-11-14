"use client";
import {Icons} from "@/components/icons";
import React, {useEffect, useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {getDoc, doc} from "firebase/firestore";
import {Slide, SlideData, TextBoxType} from "@/config/data";
import {db} from "@/config/firebase";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {createPPTX} from "../page";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import PptxGenJS from "pptxgenjs";
import {usePresentation} from "@/context/presentation-context-basic";
import {useAuth} from "@/context/user-auth";

export const SaveToCanva = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const {slideData, title} = usePresentation()!;
  const {currentUser, setShowLoginModal} = useAuth()!;

  const saveToCanva = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      if (!slideData) return;
      // 4. Save the Presentation
      setIsDownloading(true);
      const pres = await createPPTX(slideData);
      if (!pres) return;
      pres.writeFile({fileName: `${title}.pptx`}).then((fileName) => {
        console.log(`created file: ${fileName}`);
        setShowDownloadSuccess(true);
      });
      setIsDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={saveToCanva}
        className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
      >
        <Icons.Canva className="w-6 h-6 " />
        Canva
        {isDownloading ? (
          <Icons.spinner className="w-6 h-6 animate-spin mr-2 text-primary" />
        ) : (
          <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
      <Dialog open={showDownloadSuccess} onOpenChange={setShowDownloadSuccess}>
        <DialogContent className="">
          <div className="grid gap-1">
            <Icons.Canva className="w-20 h-20 mx-auto" />
            <DialogTitle className="poppins-bold text-2xl text-center">
              Downloaded & ready to edit!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your presentation is downloaded and ready to edit in Canva.
              <br />
              Click{" "}
              <a
                target="_blank"
                className="text-primary underline"
                href="https://www.canva.com/help/powerpoint-import/"
              >
                here
              </a>{" "}
              to learn how to upload it to Canva
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const SaveToCanvaFull = () => {
  // needs to be verified
  const clientId = "OC-AZL0x6smOLHY";
  const redirectUri = "http://127.0.0.1:3000/canva-redirect";
  const scopes = "design:content:write";

  const [requestingAccess, setRequestingAccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editUrl, setEditUrl] = useState<string | undefined>(undefined);

  function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async function generateCodeChallenge(codeVerifier: any) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async function saveToCanva() {
    setRequestingAccess(true);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem("code_verifier", codeVerifier); // Store code verifier for later use

    const authUrl = `https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&code_challenge=${codeChallenge}`;

    // Define a function to handle the message and remove the listener once done
    function handleMessage(event: any) {
      console.log("Message received:", event.data); // Log the entire event data for debugging
      const {code} = event.data;

      if (code) {
        popup && popup.close(); // Close the popup once code is received

        handleTokenExchange(code); // Handle the token exchange with the received code

        // Remove the event listener after handling
        window.removeEventListener("message", handleMessage);
      }
    }

    // Add the event listener to listen for messages from the popup
    window.addEventListener("message", handleMessage);

    // Open the Canva auth URL in a popup window
    const popup = window.open(authUrl, "canvaAuth", "width=600,height=600");
    const popupCloseCheck = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(popupCloseCheck);
        setRequestingAccess(false);
        // Perform any other actions you need here
      }
    }, 500);
  }

  async function handleTokenExchange(code: any) {
    const codeVerifier = sessionStorage.getItem("code_verifier");

    try {
      const tokenResponse = await fetch("/api/canva-token", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({code, codeVerifier}),
      });

      if (!tokenResponse.ok) {
        throw new Error("Token exchange failed");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      if (accessToken) {
        setRequestingAccess(false);
        setSaving(true);
        const res = await fetch("/api/save-to-canva", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token: accessToken}),
        });
        const data = await res.json();
        if (data.edit_url) {
          setEditUrl(data.edit_url);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setSaving(false);
      setRequestingAccess(false);
    }
  }

  const openInCanva = () => {
    window.open(editUrl);
    setSaving(false);
    setEditUrl(undefined);
  };

  return (
    <>
      <button
        onClick={saveToCanva}
        className="w-full flex p-2 border rounded-md py-2 h-fit text-sm whitespace-nowrap poppins-bold gap-2 items-center bg-background hover:border-primary/20 group"
      >
        <Icons.Canva className="w-6 h-6 " />
        Canva
        {requestingAccess ? (
          <Icons.spinner className="w-6 h-6 animate-spin mr-2 text-primary" />
        ) : (
          <Icons.chevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>
      <Dialog open={saving} onOpenChange={setSaving}>
        {!editUrl ? (
          <DialogContent className="">
            <div className="grid gap-1">
              <DialogTitle className="poppins-bold text-2xl text-center">
                Importing to Canva
              </DialogTitle>
              <DialogDescription className="text-center">
                this will only take a few seconds
              </DialogDescription>
            </div>

            <div className="flex w-fit mx-auto items-center gap-4">
              <Icons.logo className="w-[70px] h-[70px]" />
              <div className="flex gap-2">
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0.1}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
                <motion.div
                  animate={{scale: [1, 1.5, 1]}}
                  transition={{duration: 1, repeat: Infinity, delay: 0.2}}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
              </div>
              <Icons.Canva className="w-20 h-20 " />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="">
            <div className="grid gap-1">
              <Icons.Canva className="w-20 h-20 mx-auto" />
              <DialogTitle className="poppins-bold text-2xl text-center">
                Successfully imported to Canva!
              </DialogTitle>
              <DialogDescription className="text-center">
                Now you can edit your presentation in Canva
              </DialogDescription>
            </div>

            {editUrl && (
              <Button
                onClick={openInCanva}
                className="flex items-center justify-center w-full border rounded-md p-2 hover:border-primary"
              >
                Click here to Open
              </Button>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
