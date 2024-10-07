"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Label} from "@/components/ui/label";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import googleFonts from "@/public/fonts/fonts.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {ColorMenu} from "./color-menu";
import {DocumentColor} from "@/config/data";
import {db} from "@/config/firebase";
import {doc, getDoc, or} from "firebase/firestore";
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

  const [selectedColor, setSelectedColor] = React.useState<string>(
    selectedSlide?.background || "#ffffff"
  );

  useEffect(() => {
    setSelectedColor(selectedSlide?.background || "#ffffff");
  }, [selectedSlide]);

  const textDefaultColors = [
    "#fff",
    "#000000",
    "#fed7d7",
    "#feebc8",
    "#c6f6d5",
    "#c3dafe",
  ];

  const setBackgroundCommand = (color: string) => {
    if (slideData && selectedSlide) {
      const updatedSlideData = {
        ...slideData,
        slides: slideData.slides.map((slide) => {
          if (slide.id === selectedSlide.id) {
            return {
              ...slide,
              background: color,
            };
          }
          return slide;
        }),
      };
      setSlideData(updatedSlideData);
      addRecentColor(color);
      setSelectedColor(color);
    }
  };
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files![0]);
  };

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
    originalImage &&
    originalImage.path !== "undefined" &&
    selectedImage &&
    originalImage !== selectedImage;

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

  return (
    <div className="w-full justify-end gap-1 items-center flex">
      {selectedSlide?.backgroundImage && (
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
        <PopoverTrigger className="w-fit ">
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <button
                  className={`w-fit  h-10 flex justify-center items-center bg-background text-[12px] font-poppins border rounded-md  px-2 py-1
                  ${openMenu ? "bg-muted" : "hover:bg-muted"}
                  `}
                >
                  {selectedSlide?.backgroundImage &&
                  selectedSlide.backgroundImage.path !== "undefined" ? (
                    <img
                      src={selectedSlide.backgroundImage.path}
                      alt="background"
                      className=" rounded-[12px] h-full aspect-[16/9]"
                    />
                  ) : (
                    "Choose an Image"
                  )}
                </button>
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
          className="w-[350px] bg-background/90 blurBack p-4"
        >
          <Label className="font-bold text-lg">Background Image</Label>

          <div id="image-tab" className="flex flex-col gap-4 w-full mt-4 ">
            {/* <h1 className="font-bold text-lg">Images</h1> */}

            {userImages && userImages.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Your Images</Label>

                <div className="h-fit max-h-[250px] overflow-scroll">
                  <div className="grid grid-cols-3 gap-2">
                    {userImages.map((image: ImageType) => (
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
                        {/* <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs rounded-bl-sm">
                        <Icons.trash className="h-6 w-6" />
                      </div> */}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {userImages && userImages.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Default Images</Label>

                <div className="h-fit max-h-[250px] overflow-scroll">
                  <div className="grid grid-cols-3 gap-2">
                    {userImages.map((image: ImageType) => (
                      <button
                        key={image.title}
                        onClick={() => {
                          addImageToBackground(image);
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
                        {/* <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs rounded-bl-sm">
                        <Icons.trash className="h-6 w-6" />
                      </div> */}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                id="image-input"
                type="file"
                className="hidden"
                onInput={onFileChange}
              />
              <Button
                variant={"outline"}
                onClick={() => {
                  document.getElementById("image-input")?.click();
                }}
              >
                <Icons.upload className="h-6 w-6 mr-2" />
                Upload
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
