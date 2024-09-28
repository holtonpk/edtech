import React, {useEffect} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {Label} from "@/components/ui/label";
import {usePresentation} from "@/context/presentation-context";
import {getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";
import {Image as ImageType} from "@/config/data";

export const Image = () => {
  const {userImages, uploadImage, setUserImages, addImageToSlide} =
    usePresentation()!;

  const {currentUser} = useAuth()!;

  const fetchUserImages = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserImages(docSnap.data().userImagesLocal);
      }
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  const [open, setOpen] = React.useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files![0]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className={`flex-col transition-colors duration-200 ${
                  open ? "text-primary bg-accent" : ""
                }`}
              >
                <Icons.image className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add an image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4 w-full">
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
              <Icons.image className="h-4 w-4 mr-2" />
              Import an image
            </Button>
            <Button variant={"outline"}>
              <Icons.magicWand className="h-4 w-4 mr-2" />
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
                      key={image.path}
                      onClick={() => {
                        addImageToSlide(image, {x: 400, y: 200});
                        setOpen(false);
                      }}
                      className="h-20 w-full bg-muted rounded-sm relative border-4 border-muted hover:border-primary"
                    >
                      <img
                        src={image.path}
                        alt={image.title}
                        className="object-cover h-full w-full rounded-sm"
                      />
                      {/* <div className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs rounded-bl-sm">
                        <Icons.trash className="h-4 w-4" />
                      </div> */}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
