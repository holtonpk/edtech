import React, {Children, useEffect, useRef} from "react";

import {Icons} from "@/components/icons";
import {usePresentation} from "@/context/presentation-context";
import {Button} from "@/components/ui/button";
import {set} from "zod";

import {Label} from "@/components/ui/label";
import {Modes, Position, Image as ImageType} from "@/config/data";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";

import TabContent from "./tab-content";

const Images = () => {
  const {userImages, uploadImage, setUserImages, addImageToSlide} =
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files![0]);
  };

  return (
    <TabContent title="Images" description="Add images to your slides">
      <div className="flex flex-col gap-4 w-full mt-4s ">
        {/* <h1 className="font-bold text-lg">Images</h1> */}
        <div className="flex flex-col gap-2">
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
          <Button variant={"outline"}>
            <Icons.magicWand className="h-6 w-6 mr-2" />
            AI Magic Images
          </Button>
        </div>
        {userImages && userImages.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Your Images</Label>

            <div className="h-fit max-h-[150px] overflow-scroll">
              <div className="grid grid-cols-3 gap-2">
                {userImages.map((image: ImageType) => (
                  <button
                    key={image.title}
                    onClick={() => {
                      addImageToSlide(image, {x: 400, y: 200});
                    }}
                    className="h-20 w-full bg-muted rounded-sm relative border-4 border-muted hover:border-primary"
                  >
                    <img
                      src={image.path}
                      alt={image.title}
                      className="object-cover h-full w-full rounded-sm"
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
      </div>
    </TabContent>
  );
};

export default Images;
