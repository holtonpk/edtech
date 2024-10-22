import React, {Children, useEffect, useRef} from "react";

import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
import {set} from "zod";

import {Label} from "@/components/ui/label";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import {ScrollArea} from "@/components/ui/scroll-area";

import TabContent from "./tab-content";
import {useHover} from "..";

const Images = ({
  onFileChange,
  isLoaderImage,
  setIsLoaderImage,
}: {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoaderImage: boolean;
  setIsLoaderImage: (value: boolean) => void;
}) => {
  const {userImages, uploadImage, setUserImages, addImageToSlide, setMode} =
    usePresentation()!;

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

  const [open, setOpen] = React.useState(false);

  const {isHovering, setIsHovering, setIsHoveringGroup} = useHover()!;

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
    <TabContent title="Images" description="Add images to your slides">
      <div className="flex flex-col gap-4 w-full mt-4s h-fit md:h-[calc(100%-48px)]">
        {/* <h1 className="font-bold text-lg">Images</h1> */}

        {userImages && userImages.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 h-full ">
              {/* <Label className="font-bold">Your Images</Label> */}

              <ScrollArea
                className={`pr-4 
                  ${isHovering ? "h-[168px]" : "h-[168px] md:h-[400px]"} `}
              >
                <div className="grid grid-cols-3 gap-2">
                  {isLoaderImage && (
                    <div className="w-full h-20 bg-background rounded-sm relative border-4 border-muted overflow-hidden flex items-center justify-center">
                      {/* <div className="w-full h-full bg-cover bg-muted-foreground/40 bg-center animate-pulse" /> */}
                      <Icons.spinner className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  )}
                  {[...userImages].reverse().map((image: ImageType) => (
                    <div
                      key={image.title}
                      className="h-20 w-full bg-muted rounded-sm relative border-4 border-muted hover:border-primary overflow-hidden group flex items-center justify-center"
                    >
                      <button
                        onClick={() => {
                          addImageToSlide(image, {x: 400, y: 200});
                        }}
                      >
                        <img
                          src={image.path}
                          alt={image.title}
                          className="object-covers  w-full unSelectable pointer-events-none"
                        />
                      </button>

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
            {isHovering && (
              <div className="flex flex-col gap-2 mt-auto absolute bottom-4 right-4">
                <input
                  id="image-input"
                  type="file"
                  className="hidden"
                  onInput={onFileChange}
                />
                <Button
                  className="text-[12px] flex items-center justify-center rounded-full h-fit p-4 w-fit group hover:bg-primary"
                  onClick={() => {
                    document.getElementById("image-input")?.click();
                  }}
                >
                  <Icons.upload className="h-6 w-6 group-hover:-translate-y-[20%] transition-transform duration-700" />
                </Button>
                {/* <Button variant={"outline"}>
              <Icons.magicWand className="h-6 w-6 mr-2" />
              AI Magic Images
            </Button> */}
              </div>
            )}

            {!isHovering && (
              <div className="flex flex-col gap-2 mt-auto">
                <input
                  id="image-input"
                  type="file"
                  className="hidden"
                  onInput={onFileChange}
                />
                <Button
                  onClick={() => {
                    document.getElementById("image-input")?.click();
                  }}
                >
                  <Icons.image className="h-6 w-6 mr-2" />
                  Import an image
                </Button>
                {/* <Button variant={"outline"}>
              <Icons.magicWand className="h-6 w-6 mr-2" />
              AI Magic Images
            </Button> */}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 h-full mt-2">
            <input
              id="image-input-no"
              type="file"
              className="hidden"
              onInput={onFileChange}
            />
            <Button
              variant={"outline"}
              className="flex-col py-6 text-primary h-full"
              onClick={() => {
                document.getElementById("image-input-no")?.click();
              }}
            >
              <Icons.image className="h-6 w-6 " />
              click to import images
            </Button>
          </div>
        )}
      </div>
    </TabContent>
  );
};

export default Images;
