"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PptxGenJS from "pptxgenjs";
import {
  extractTextFromHTML,
  convertPxToInches,
  imageUrlToBase64,
} from "@/lib/utils";
import {useAuth} from "@/context/user-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useRouter} from "next/router";

const Share = () => {
  const [isPublic, setIsPublic] = React.useState(false);
  const {saveFileToGoogleDrive} = useAuth()!;
  const {slideData, title} = usePresentation()!;

  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = React.useState(false);

  const createPPTX = async () => {
    if (!slideData) return;

    let pres = new PptxGenJS();

    for (const slide of slideData.slides) {
      let slideFile = pres.addSlide(slide.title);

      if (slide.backgroundImage && slide.backgroundImage.path !== "undefined") {
        const imageData = (await imageUrlToBase64(
          slide.backgroundImage.path
        )) as string;

        slideFile.background = {data: imageData};
      } else {
        slideFile.background = {color: slide.background || "#ffffff"};
      }

      slide.textBoxes.forEach((textBox) => {
        const textBoxUi = document.getElementById(
          "mini-slide-textbox-" + textBox.textBoxId
        );
        if (!textBoxUi) return;
        const textBoxUiRect = textBoxUi.getBoundingClientRect();

        const paragraph = textBoxUi.querySelector("p");
        if (!paragraph) return;
        const font = paragraph?.querySelector("font");
        const fontFace = font?.getAttribute("face") || "Arial";
        const color = font?.getAttribute("color");

        // create an element for the text
        const element = document.createElement("div");
        element.style.position = "fixed";

        element.style.width = textBox.size.width + "px";
        element.style.fontSize = textBox.fontSize + "px";
        element.style.textAlign = textBox.textAlign
          ? textBox.textAlign
          : "left";
        element.style.height = "fit-content";
        element.innerHTML = textBox.text;
        element.style.lineHeight = "1.15";
        element.style.padding = ".05in .1in .05in .1in";
        document.body.appendChild(element);
        const height = element.getBoundingClientRect().height;

        // remove the element
        document.body.removeChild(element);

        const isBold = textBoxUi?.querySelector("b") !== null;
        const isItalic = textBoxUi?.querySelector("i") !== null;
        const isUnderline = textBoxUi?.querySelector("u") !== null;
        const isStrike = textBoxUi?.querySelector("strike") !== null;

        console.log("isBold", isBold);
        console.log("isItalic", isItalic);
        console.log("isUnderline", isUnderline);
        console.log("isStrike", isStrike);

        slideFile.addText(extractTextFromHTML(textBox.text), {
          x: convertPxToInches(textBox.position.x),
          y: convertPxToInches(textBox.position.y),
          w: convertPxToInches(textBox.size.width),
          h: convertPxToInches(height),
          fontSize: textBox.fontSize / 1.44,
          color: color || "#000000",
          fontFace: fontFace,
          bold: isBold,
          italic: isItalic,
          underline: isUnderline ? {style: "sng"} : {style: "none"},
          strike: isStrike,
          // transparency: textBox.textOpacity ? textBox.textOpacity * 100 : 0,
        });
      });

      for (const image of slide.images) {
        const element = document.createElement("img");
        element.src = image.image.path;
        element.style.position = "fixed";
        element.style.width = image.size.width + "px";
        element.style.height = "auto";
        // element.style.zIndex = "9999";
        // element.style.top = "0px";
        // element.style.left = "0px";

        document.body.appendChild(element);
        const height = element.getBoundingClientRect().height;
        document.body.removeChild(element);

        // create base64 encoded image

        const imageData = (await imageUrlToBase64(image.image.path)) as string;

        slideFile.addImage({
          data: imageData,
          x: convertPxToInches(image.position.x),
          y: convertPxToInches(image.position.y),
          w: convertPxToInches(image.size.width),
          h: convertPxToInches(height),
        });
      }
    }

    return pres;
  };

  const savePPTX = async () => {
    if (!slideData) return;
    // 4. Save the Presentation
    setIsSavingToDrive(true);
    const pres = await createPPTX();
    if (!pres) return;
    pres.writeFile({fileName: `${title}.pptx`}).then((fileName) => {
      console.log(`created file: ${fileName}`);
    });
    setIsDownloading(false);
  };

  const [driveUrl, setDriveUrl] = React.useState("");
  const [showDriveSuccess, setShowDriveSuccess] = React.useState(false);

  const savePPTXToDrive = async () => {
    if (!slideData) return;

    // Show loading state while saving the presentation
    setIsSavingToDrive(true);

    // 1. Create the PPTX file
    const pres = await createPPTX();
    if (!pres) {
      setIsSavingToDrive(false);
      return;
    }

    // 2. Convert the PPTX to a Blob to prepare for upload
    const pptxBlob = await pres.write({outputType: "blob"});

    const res = await saveFileToGoogleDrive(pptxBlob as Blob, `${title}.pptx`);

    if (res?.success) {
      console.log(res.data);
      setDriveUrl(`https://docs.google.com/presentation/d/${res.data.id}`);
      setShowDriveSuccess(true);
    }

    // Remove loading state once the process is complete
    setIsSavingToDrive(false);
    setOpenMenu(false);
  };

  const openInDrive = () => {
    window.open(driveUrl, "_ blank");
  };

  const [openMenu, setOpenMenu] = React.useState(false);

  const [isCopied, setIsCopied] = React.useState(false);

  const copyLink = () => {
    // copy current url to clipboard
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <Icons.upload className="w-4 h-4 mr-3" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 flex flex-col gap-2 ">
          <div className="grid gap-2">
            <Label>Collaboration Link</Label>
            <Select
              value={isPublic ? "public" : "private"}
              onValueChange={(value) => setIsPublic(value == "public")}
            >
              <SelectTrigger className="w-[300px] ">
                <SelectValue className="flex items-center leading-[5px]">
                  {isPublic ? (
                    <div className="flex items-center">
                      <Icons.public className="w-2 h-2 mr-2" />
                      Anyone with the link
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Icons.lock className="w-4 h-4 mr-2" />
                      Only you can Access
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="private"
                  className="items-center flex hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center">
                    <Icons.lock className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <h1 className="font-bold">Only you can Access</h1>
                      <p className="text-muted-foreground text-sm">
                        Only you can access the presentation with this link
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem
                  value="public"
                  className="items-center flex hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center">
                    <Icons.public className="w-4 h-4 mr-2" />
                    <div className="flex flex-col">
                      <h1 className="font-bold">Anyone with the link</h1>

                      <p className="text-muted-foreground text-sm">
                        Anyone with the link can access and edit the
                        presentation
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={copyLink}>
              {isCopied ? (
                <>
                  <Icons.check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Icons.copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <Button
            onClick={savePPTX}
            variant={"ghost"}
            className="justify-start"
          >
            {isDownloading ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Icons.download className="w-4 h-4 mr-2" />
            )}
            Download
          </Button>
          <Button
            onClick={savePPTXToDrive}
            variant={"ghost"}
            className="justify-start"
          >
            {isSavingToDrive ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Icons.googleDrive className="w-4 h-4 mr-2" />
            )}
            Save to Google Drive
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <AlertDialog open={showDriveSuccess} onOpenChange={setShowDriveSuccess}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <button className="absolute top-4 right-4">
            <Icons.close className="w-4 h-4" />
          </button>
          <AlertDialogHeader>
            <AlertDialogTitle>File saved to your drive!</AlertDialogTitle>

          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <Dialog open={showDriveSuccess} onOpenChange={setShowDriveSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File saved to your drive!</DialogTitle>
            <DialogDescription>
              Your file is now saved in google drive. Changes to your project in
              google drive will not show up here
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={openInDrive}
            className="flex items-center justify-center w-full border rounded-md p-2 hover:border-primary"
          >
            <Icons.googleDrive className="w-4 h-4 mr-2" />
            Click to open in Google Drive
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;

// 1.46
// 1.22
