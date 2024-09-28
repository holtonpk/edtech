"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import ProfileNav from "../../../components/profile-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Present from "./present";
import {Input} from "@/components/ui/input";
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

const ToolBar = () => {
  const {slideData, title, setTitle} = usePresentation()!;

  const [isPublic, setIsPublic] = React.useState(false);

  return (
    <div className="h-[60px] w-full py-2  flex items-center justify-between px-4 border rounded-md bg-background/30 relative z-[50]">
      <div className="flex gap-1 items-center ">
        <Icons.lightbulb className="w-6 h-6 " />
        <h1 className="font-bold ">EDTech tool</h1>
      </div>
      <div className="flex items-center  gap-4">
        <Undo />
        {/* <div className="h-[30px] w-[1px] bg-black/60"></div> */}

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger className="disableTextboxListeners">
              <Input
                placeholder="give your project a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-96 overflow-hidden text-ellipsis disableSelector"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Project title</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <div className="h-[30px] w-[1px] bg-black/60"></div>s */}
        <SaveStatus />
      </div>
      <div className="flex items-center  gap-4  p-3 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <Icons.upload className="w-4 h-4 mr-3" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4 flex flex-col gap-2">
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
              <Button>
                <Icons.copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <Button variant={"ghost"} className="justify-start">
              <Icons.download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant={"ghost"} className="justify-start">
              <Icons.googleDrive className="w-4 h-4 mr-2" />
              Save to Google Drive
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        <Present />

        {/* <ProfileNav /> */}
      </div>
    </div>
  );
};

export default ToolBar;

const Undo = () => {
  const {
    history,
    setSlideData,
    historyIndex,
    setHistoryIndex,
    setSelectedSlide,
    selectedSlide,
  } = usePresentation()!;

  const handleChangeIndex = (index: number) => {
    if (index < 0 || index >= history.length) return;
    setHistoryIndex(index);
    setSlideData(history[index]);
    if (
      !history[historyIndex + index].slides.find(
        (slide) => slide.id === selectedSlide?.id
      )
    ) {
      setSelectedSlide(history[historyIndex + index].slides[0]);
    }
  };

  return (
    <div className="flex  ">
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              disabled={historyIndex >= history.length - 1}
              onClick={() => {
                handleChangeIndex(historyIndex + 1);
              }}
              variant={"ghost"}
              className="p-2"
            >
              <Icons.undo className="w-6 h-6 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center">
            Undo
            <div className="flex gap-1 mt-[2px]">
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                ⌘
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                Z
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              disabled={historyIndex == 0}
              onClick={() => {
                handleChangeIndex(historyIndex - 1);
              }}
            >
              <Icons.redo className="w-6 h-6 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col items-center">
            Redo
            <div className="flex gap-1 mt-[2px]">
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                <Icons.shift className="w-[10px] h-[10px] " />
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                ⌘
              </div>
              <div className="text-[8px] leading-[8px] p-1 w-fit  rounded-[6px] bg-white items-center justify-center flex aspect-square border border-gray-400">
                Z
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const SaveStatus = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Icons.save className="w-6 h-6 opacity-60 text-black" />
        </TooltipTrigger>
        <TooltipContent>
          <p>All changes saved!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
