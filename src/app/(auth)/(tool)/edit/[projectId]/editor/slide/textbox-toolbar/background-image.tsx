"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Label} from "@/components/ui/label";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {ColorMenu} from "./color-menu";
import {DocumentColor} from "@/config/data";
import {db} from "@/config/firebase";
import {doc, getDoc, or, updateDoc} from "firebase/firestore";
import {useAuth} from "@/context/user-auth";

export const BackgroundImage = () => {
  const {
    slideData,
    setSlideData,
    addRecentColor,
    slideDataRef,
    userImages,
    uploadImage,
    setUserImages,
    addImageToSlide,
    selectedSlide,
    addImageToBackground,
  } = usePresentation()!;

  const [openMenu, setOpenMenu] = React.useState(false);

  const {currentUser} = useAuth()!;

  useEffect(() => {
    const fetchUserImages = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserImages(docSnap.data().userImagesLocal);
        }
      }
    };
    fetchUserImages();
  }, [currentUser, setUserImages]);

  const [selectedImage, setSelectedImage] = React.useState<
    ImageType | undefined
  >(undefined);

  useEffect(() => {
    setSelectedImage(undefined);
  }, [openMenu]);

  const [isLoaderImage, setIsLoaderImage] = React.useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsLoaderImage(true);
    await uploadImage(e.target.files![0]);
    setIsLoaderImage(false);
  }

  const removeBackgroundImage = () => {
    if (slideDataRef.current && selectedSlide) {
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              backgroundImage: {
                path: "undefined",
                title: "undefined",
              },
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
    }
  };

  const [originalImage, setOriginalImage] = React.useState<
    ImageType | undefined
  >();

  useEffect(() => {
    setOriginalImage(selectedSlide?.backgroundImage);
  }, [openMenu]);

  const suggestChangeAll =
    selectedImage && originalImage && originalImage !== selectedImage;

  useEffect(() => {
    if (suggestChangeAll) {
      const colorTab = document.getElementById("image-tab");
      const height = colorTab?.getBoundingClientRect().height;
      colorTab?.setAttribute("style", `height: ${height}px`);
      colorTab?.classList.add("pb-[54px]");
      colorTab?.classList.add("overflow-y-scroll");
      colorTab?.scrollTo(0, 0);
    } else {
      const colorTab = document.getElementById("image-tab");
      colorTab?.setAttribute("style", `height: auto`);
      colorTab?.classList.remove("pb-[54px]");
      colorTab?.classList.remove("overflow-y-scroll");
    }
  }, [suggestChangeAll]);

  const addImageToAllSlides = () => {
    if (slideDataRef.current && selectedSlide) {
      const updatedSlideData = {
        ...slideDataRef.current,
        slides: slideDataRef.current.slides.map((slide) => {
          return {
            ...slide,
            backgroundImage: selectedImage,
          };
        }),
      };
      setSlideData(updatedSlideData);
    }
    setOriginalImage(selectedImage);
  };

  const [defaultImages, setDefaultImages] = React.useState<ImageType[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const userRef = doc(db, "users", "TV8IByKFFFaupS1HV4qg6Xaw1Xc2");
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const defaultImages = userSnap.data().userImagesLocal;
        setDefaultImages(defaultImages);
      }
    };
    fetchImages();
  }, []);

  const deleteImage = async (image: ImageType) => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userImages = userSnap.data().userImagesLocal;
        const updatedImages = userImages.filter(
          (img: ImageType) => img.path !== image.path
        );
        setUserImages(updatedImages);
        await updateDoc(userRef, {
          userImagesLocal: updatedImages,
        });
      }
    }
  };

  return (
    <div className="w-full justify-end  items-center flex">
      {selectedSlide?.backgroundImage &&
        selectedSlide?.backgroundImage.path !== "undefined"! && (
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <button
                  onClick={removeBackgroundImage}
                  className="p-2 rounded-full h-fit w-fit hover:bg-muted"
                >
                  <Icons.close className="h-4 w-4 " />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove background image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      <Popover open={openMenu} onOpenChange={setOpenMenu}>
        <PopoverTrigger className=" w-[65px]  relative h-10">
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                {selectedSlide?.backgroundImage &&
                selectedSlide.backgroundImage.path !== "undefined" ? (
                  <button
                    className={`w-fit absolute h-10 flex justify-center items-center bg-background text-[12px] font-poppins border rounded-md   p-1 right-0 top-0
                  ${openMenu ? "bg-muted" : "hover:bg-muted"}
                  `}
                  >
                    <img
                      src={selectedSlide.backgroundImage.path}
                      alt="background"
                      className=" rounded-[12px] h-full aspect-[16/9]"
                    />
                  </button>
                ) : (
                  <button
                    className={`w-fit absolute h-10 flex justify-center items-center bg-background text-[12px] font-poppins border rounded-md  px-2 py-1 whitespace-nowrap right-0 top-0
                  ${openMenu ? "bg-muted" : "hover:bg-muted"}
                  `}
                  >
                    Choose an Image
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Background Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="left"
          className="w-[350px] bg-background/90 blurBack p-4 pr-1"
        >
          <Label className="font-bold text-lg">Background Image</Label>

          <div id="image-tab" className="flex flex-col gap-4 w-full mt-3">
            {/* <h1 className="font-bold text-lg">Images</h1> */}

            {((userImages && userImages.length > 0) || isLoaderImage) && (
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Your Images</Label>
                <ScrollArea
                  className={`pr-4 
                  ${userImages && userImages.length > 6 ? "h-[120px]" : "h-fit"}
                  
                  
                  `}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {isLoaderImage && (
                      <div className="w-full aspect-[16/9] bg-background rounded-sm relative border-4 border-muted overflow-hidden flex items-center justify-center">
                        {/* <div className="w-full h-full bg-cover bg-muted-foreground/40 bg-center animate-pulse" /> */}
                        <Icons.spinner className="h-6 w-6 text-primary animate-spin" />
                      </div>
                    )}
                    {userImages &&
                      userImages.length > 0 &&
                      [...userImages].reverse().map((image: ImageType) => (
                        <div
                          key={image.title}
                          style={{
                            background: selectedSlide
                              ? selectedSlide.background
                              : "#ffffff",
                          }}
                          className={`w-full aspect-[16/9] bg-background rounded-sm relative border-4 border-muted group overflow-hidden
        ${
          selectedSlide?.backgroundImage &&
          selectedSlide?.backgroundImage.path === image.path
            ? "border-primary"
            : "border-border hover:border-primary"
        }`}
                        >
                          <button
                            onClick={() => {
                              addImageToBackground(image);
                              setSelectedImage(image);
                            }}
                            className="h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  overflow-hidden "
                          >
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${image.path})`,
                              }}
                            />
                          </button>

                          {/* Fixed-wrapper for delete-image-button */}

                          <div className="absolute z-30 -top-[0px] -right-[24px] fixed-wrapper h-[24px] w-[24px] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:fade-in-200">
                            <button
                              onClick={() => deleteImage(image)}
                              id="delete-image-button"
                              className="fixed -translate-x-1/2  p-1 bg-opacity-50 text-white text-xs bg-theme-red rounded-full"
                              style={{
                                marginTop: "-8px", // Adjust this as necessary
                                marginRight: "-8px", // Adjust this as necessary
                              }}
                            >
                              <Icons.close className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            {defaultImages && defaultImages.length > 0 && (
              <div className="flex flex-col gap-2">
                {userImages && userImages.length > 0 && (
                  <Label className="font-bold">Default Images</Label>
                )}

                <ScrollArea className=" h-[240px] pr-4">
                  <div className="grid grid-cols-3 gap-2">
                    {defaultImages.map((image: ImageType) => (
                      <button
                        key={image.title}
                        onClick={() => {
                          addImageToBackground(image);
                          setSelectedImage(image);
                        }}
                        style={{
                          background: selectedSlide
                            ? selectedSlide.background
                            : "#ffffff",
                        }}
                        className={` w-full overflow-hidden aspect-[16/9] bg-background rounded-sm relative border-4 border-muted 
                        ${
                          selectedSlide?.backgroundImage &&
                          selectedSlide?.backgroundImage.path === image.path
                            ? "border-primary"
                            : "border-border hover:border-primary"
                        }
                        `}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${image.path})`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                id="image-input-background"
                type="file"
                className="hidden"
                onInput={onFileChange}
              />
              <Button
                variant={"outline"}
                onClick={() => {
                  document.getElementById("image-input-background")?.click();
                }}
              >
                <Icons.upload className="h-6 w-6 mr-2" />
                Upload images
              </Button>
            </div>
          </div>
          <button
            onClick={() => setOpenMenu(false)}
            className="absolute top-3 right-3"
          >
            <Icons.close className="h-4 w-4 hover:text-primary" />
          </button>
          {suggestChangeAll && (
            <div className="w-full  h-[60px]  overflow-hidden absolute bottom-0 left-0 ">
              <div className="slide-top absolute top-0 border-t  bg-background rounded-b-md h-fit w-full flex items-center  py-2 px-2 justify-between">
                <Button onClick={addImageToAllSlides} className="w-full">
                  Apply to all
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
