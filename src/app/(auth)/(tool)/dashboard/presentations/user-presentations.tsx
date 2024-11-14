"use client";
import {Icons} from "@/components/icons";
import React, {
  useContext,
  useRef,
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  FullSlideData,
  Slide,
  Modes,
  AlignType,
  TextBoxType,
  Image,
  Position,
  Size,
} from "@/config/data";
import {db} from "@/config/firebase";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
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
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import ProfileNav from "@/src/app/(auth)/(tool)/components/profile-nav";
import {useAuth, UserData} from "@/context/user-auth";
import {FileLocal} from "@/config/data";
import {formatTimeDifference} from "@/lib/utils";
import {useSidebar} from "@/components/ui/sidebar";
import {createNewBlankPresentation} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LinkButton} from "@/components/ui/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MAX_UNSUB_GENERATIONS} from "@/config/data";
import {useUserData} from "@/context/user-data-context";

export const UserPresentations = () => {
  const {currentUser, unSubscribedUserId, setShowLoginModal} = useAuth()!;
  const {userPresentations, isLoading} = useUserData()!;

  const [selectedPresentation, setSelectedPresentation] = useState<
    string | undefined
  >(currentUser?.presentations[1]);

  const [isLoadingNew, setIsLoadingNew] = useState(false);

  const router = useRouter();

  const createNew = async () => {
    if (!currentUser && userPresentations.length >= MAX_UNSUB_GENERATIONS) {
      setShowLoginModal(true);
    } else {
      router.push(`/create`);
      setIsLoadingNew(false);
    }
  };

  const sortPresentationsByDateAsc = (presentations: FullSlideData[]) => {
    return presentations.sort((a, b) => {
      const dateA = (a.createdAt as Timestamp).toMillis();
      const dateB = (b.createdAt as Timestamp).toMillis();
      return dateA - dateB;
    });
  };

  const sortPresentationsByDateDesc = (presentations: FullSlideData[]) => {
    return presentations.sort((a, b) => {
      const dateA = (a.createdAt as Timestamp).toMillis();
      const dateB = (b.createdAt as Timestamp).toMillis();
      return dateB - dateA;
    });
  };

  const presentations = sortPresentationsByDateDesc(userPresentations);

  const [display, setDisplay] = useState<"grid" | "list">("grid");

  return (
    <>
      {isLoading ? (
        <div className="grid gap-1">
          <div className="flex w-full justify-between">
            <div className="w-[200px] h-8 bg-muted animate-pulse rounded-sm"></div>
            <div className="w-[200px] h-8 bg-muted animate-pulse rounded-sm"></div>
          </div>

          <div className="grid mt-4 grid-cols-4 gap-8 w-full">
            {Array.from({length: 4}).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 bg-background shadow-sm rounded-lg overflow-hidden  relative"
              >
                <div className="rounded-md  rounded-b-none w-full relative aspect-[16/9] overflow-hidden  flex items-center justify-center  shadow-sm bg-muted animate-pulse"></div>
                <div className="flex flex-col w-full p-4 pt-1 overflow-hidden">
                  <div className="w-full h-[50px] bg-muted animate-pulse rounded-sm" />
                  <div className="h-[32px] w-full bg-muted animate-pulse  mt-2 rounded-sm" />
                  <div className=" h-[40px] bg-muted animate-pulse mt-2 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-1">
          {presentations && presentations.length > 0 ? (
            <>
              <div className="flex w-full justify-between">
                <button
                  onClick={() => createNew()}
                  className="w-fit border rounded-md flex gap-1 items-center text-left group grad-animation text-white py-2 shadow-lg text-primary px-4  transition-all duration-300"
                >
                  <Icons.add className="w-5 h-5 " />
                  <h1 className="font-bold ">Create a New Presentation</h1>
                </button>
                <div className="w-[200px] p-1 bg-muted rounded-md grid grid-cols-2 poppins-regular">
                  <button
                    onClick={() => setDisplay("grid")}
                    className={`w-full p-2 items-center text-sm justify-center  rounded-sm flex gap-2
          ${display === "grid" ? "bg-background " : "bg-none"}`}
                  >
                    <Icons.grid className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setDisplay("list")}
                    className={`w-full p-2 items-center text-sm justify-center rounded-sm flex gap-2
          ${display === "list" ? "bg-background " : "bg-none"}`}
                  >
                    <Icons.alignJustify className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-4 w-full  flex-wrap">
                {display === "grid" ? (
                  <>
                    <div className="grid grid-cols-4 gap-8 w-full">
                      {presentations.map((presentation, index) => (
                        <PresentationCard
                          presentation={presentation}
                          key={presentation.id}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <PresentationTable presentations={presentations} />
                )}
              </div>
            </>
          ) : (
            <div className=" w-full flex pt-20   h-[calc(100vh-80px)]">
              <LinkButton
                href="/create"
                className="w-fit hover:bg-background p-0 group hover:rotate-[-.5deg] hover:scale-[105%] transition-transform duration-300 shadow-lg overflow-hidden mx-auto rounded-md h-fit flex items-center justify-center flex-col gap-3 bg-background border "
              >
                {/* <Icons.sad className="w-12 h-12 text-muted-foreground" /> */}
                <Icons.presIll className="w-[400px]  " />
                <div className="flex flex-col p-8 pb-4 pt-0 gap-3 items-center">
                  <div className="grid gap-1">
                    <h1 className=" text-xl poppins-bold text-black">
                      You don&apos;t have any projects
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Create your first project in just a few clicks
                    </p>
                  </div>
                  <div className="justify-center w-fit border rounded-md flex gap-1 items-center text-left group bg-primary text-white py-2 shadow-lg text-primary px-4  transition-all duration-300 text-white">
                    Create a new project
                    <Icons.chevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    {isLoadingNew && (
                      <Icons.spinner className="animate-spin w-5 h-5 text-white ml-2" />
                    )}
                  </div>
                </div>
              </LinkButton>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const PresentationTable = ({
  presentations,
}: {
  presentations: FullSlideData[];
}) => {
  return (
    <Table className="h-fit ">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>

          <TableHead className="w-[300px]">Title</TableHead>
          <TableHead>Last Viewed</TableHead>
          <TableHead>Creator</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-fit">
        {presentations.map((presentation) => (
          <PresTableRow key={presentation.id} presentation={presentation} />
        ))}
      </TableBody>
    </Table>
  );
};

const PresTableRow = ({presentation}: {presentation: FullSlideData}) => {
  const [title, setTitle] = useState<string | undefined>(presentation.title);

  const [slide, setSlide] = useState<Slide | undefined>(undefined);

  const dataIsFetched = useRef(false);

  const {currentUser} = useAuth()!;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const docRef = doc(db, "presentations", presId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setSlide(docSnap.data().slideData.slides[0]);
  //       setTitle(docSnap.data().title);
  //       setPresentation(docSnap.data() as FullSlideData);
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   };

  //   if (!dataIsFetched.current) {
  //     fetchData();
  //     dataIsFetched.current = true;
  //   }
  // }, [presId]);

  type creatorData = {
    photoURL: string;
    displayName: string;
    firstName: string;
    lastName: string;
  };

  const [creator, setCreator] = useState<creatorData | undefined>();

  useEffect(() => {
    if (presentation?.creator) {
      // fetch creator data
      const fetchCreator = async () => {
        const docRef = doc(db, "users", presentation.creator as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCreator({
            photoURL: docSnap.data()?.photoURL as string,
            displayName: docSnap.data()?.displayName as string,
            firstName: docSnap.data()?.firstName as string,
            lastName: docSnap.data()?.lastName as string,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      };
      fetchCreator();
    } else {
      if (currentUser) {
        setCreator({
          photoURL: currentUser?.photoURL as string,
          displayName: currentUser?.displayName as string,
          firstName: currentUser?.firstName as string,
          lastName: currentUser?.lastName as string,
        });
      }
    }
  }, [presentation]);

  const router = useRouter();

  console.log("creator", creator);

  return (
    <TableRow className="relative overflow-hidden">
      <button
        onClick={() => {
          router.push(`/presentation/${presentation.id}`);
        }}
        className="absolute w-full h-full  z-10 bgs-red-600"
      ></button>
      <TableCell className="font-medium max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap ">
        {title}
      </TableCell>
      <TableCell>
        {presentation?.createdAt &&
          formatTimeDifference(presentation?.createdAt as Timestamp)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          {creator && (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={creator && creator.photoURL}
                alt={(creator && creator.displayName) || "User"}
              />
              <AvatarFallback>
                {creator &&
                  creator?.firstName?.charAt(0).toUpperCase() +
                    creator?.lastName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <h1 className="poppins-regular text-sm">
            {creator?.displayName === currentUser?.displayName
              ? "Created by You"
              : creator?.displayName}
          </h1>
        </div>
      </TableCell>
      <TableCell className="relative z-20">
        <Options
          presId={presentation.id}
          title={title || ""}
          setTitle={setTitle}
        />
      </TableCell>
    </TableRow>
  );
};

const PresentationCard = ({presentation}: {presentation: FullSlideData}) => {
  const [title, setTitle] = useState<string | undefined>(presentation.title);

  const [slide, setSlide] = useState<Slide | undefined>(
    presentation.slideData.slides[0]
  );

  const {currentUser} = useAuth()!;

  const selectorContainerRef = React.useRef<HTMLDivElement>(null);

  const [thumbScale, setThumbScale] = useState<number | undefined>(undefined);

  const {open} = useSidebar();

  const setScale = () => {
    const selectorContainer = selectorContainerRef.current;
    if (!selectorContainer) return;
    const calculateScale = selectorContainer.clientWidth / 1000;
    setThumbScale(calculateScale + 0.01);
  };
  React.useEffect(() => {
    window.addEventListener("resize", setScale);
    return () => {
      window.removeEventListener("resize", setScale);
    };
  }, []);

  React.useEffect(() => {
    setScale();
  }, [slide]);

  React.useEffect(() => {
    setTimeout(() => {
      setScale();
    }, 210);
  }, [open]);

  const router = useRouter();

  type creatorData = {
    photoURL: string;
    displayName: string;
    firstName: string;
    lastName: string;
  };

  const [creator, setCreator] = useState<creatorData | undefined>();

  useEffect(() => {
    if (presentation?.creator) {
      // fetch creator data
      const fetchCreator = async () => {
        const docRef = doc(db, "users", presentation.creator as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCreator({
            photoURL: docSnap.data()?.photoURL as string,
            displayName: docSnap.data()?.displayName as string,
            firstName: docSnap.data()?.firstName as string,
            lastName: docSnap.data()?.lastName as string,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      };
      fetchCreator();
    } else {
      if (currentUser) {
        setCreator({
          photoURL: currentUser?.photoURL as string,
          displayName: currentUser?.displayName as string,
          firstName: currentUser?.firstName as string,
          lastName: currentUser?.lastName as string,
        });
      }
    }
  }, [presentation]);

  return (
    <div className="flex flex-col gap-2 bg-background rounded-lg overflow-hidden shadow-lg hover:scale-[102%] transition-transform duration-300 relative">
      <button
        onClick={() => {
          router.push(`/presentation/${presentation.id}`);
        }}
        className="w-full h-full absolute z-30"
      ></button>
      {slide ? (
        <>
          <div
            ref={selectorContainerRef}
            className={`rounded-md  rounded-b-none w-full relative aspect-[16/9] overflow-hidden  flex items-center justify-center   duration-300  transition-all shadow-sm
    
    `}
          >
            {thumbScale ? (
              <div
                className="w-[1000px]   aspect-[16/9] absolute overflow-hidden"
                style={{transform: `scale(${thumbScale})`}}
              >
                {slide &&
                slide.backgroundImage &&
                slide.backgroundImage.path !== "undefined" ? (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.backgroundImage.path})`,
                    }}
                  />
                ) : (
                  <div
                    className="absolute w-full h-full bg-cover bg-center"
                    style={{
                      backgroundColor: slide ? slide.background : "#ffffff",
                      opacity: slide?.backgroundOpacity
                        ? slide?.backgroundOpacity
                        : 1,
                    }}
                  />
                )}
                {slide.textBoxes &&
                  slide.textBoxes.map((textbox: TextBoxType, index: number) => (
                    <div
                      key={index}
                      className=" p-2 absolute pointer-events-none"
                      style={{
                        top: textbox.position.y,
                        left: textbox.position.x,
                        height: "fit-content",
                        width: textbox.size.width,
                        transform: `rotate(${textbox.rotation}deg)`,
                        fontSize: `${textbox.fontSize}px`,
                      }}
                      dangerouslySetInnerHTML={{__html: textbox.text}}
                    />
                  ))}
                {slide.images &&
                  slide.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        top: image.position.y,
                        left: image.position.x,
                        width: image.size.width,
                        transform: `rotate(${image.rotation}deg)`,
                      }}
                      className="p-2 h-fit w-fit absolute origin-center pointer-events-none"
                    >
                      <img
                        src={image.image.path}
                        alt={image.image.title}
                        className="origin-center p-2 pointer-events-none h-full w-full"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-md  rounded-b-none w-full relative aspect-[16/9] overflow-hidden  flex items-center justify-center  shadow-sm bg-muted animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col w-full p-4 pt-1 overflow-hidden">
            <h1 className="font-bold  text-ellipsis max-w-full overflow-hidden dashboard-presentCard-title ">
              {title}
            </h1>
            <div className="p-2 bg-muted flex items-center gap-1 text-[12px] text-muted-foreground poppins-bold rounded-sm w-fit px-2 mt-2">
              <Icons.lock style={{height: 16, width: 16}} />
              Private
            </div>
            <div className="grid grid-cols-[1fr_30px] gap-2 mt-2">
              <div className="flex items-center gap-2">
                {creator && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={creator && creator.photoURL}
                      alt={(creator && creator.displayName) || "User"}
                    />
                    <AvatarFallback>
                      {creator &&
                        creator?.firstName?.charAt(0).toUpperCase() +
                          creator?.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col">
                  <h1 className="poppins-regular text-sm">
                    {creator?.displayName === currentUser?.displayName
                      ? "Created by You"
                      : creator?.displayName}
                  </h1>

                  <h2 className="font-bold text-[12px] text-muted-foreground poppins-regular">
                    {presentation?.createdAt &&
                      formatTimeDifference(
                        presentation?.createdAt as Timestamp
                      )}
                  </h2>
                </div>
              </div>
              <Options
                presId={presentation.id}
                title={title || ""}
                setTitle={setTitle}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-md  rounded-b-none w-full relative aspect-[16/9] overflow-hidden  flex items-center justify-center  shadow-sm bg-muted animate-pulse"></div>
          <div className="flex flex-col w-full p-4 pt-1 overflow-hidden">
            <div className="w-full h-[50px] bg-muted animate-pulse rounded-sm" />
            <div className="h-[32px] w-full bg-muted animate-pulse  mt-2 rounded-sm" />
            <div className=" h-[40px] bg-muted animate-pulse mt-2 rounded-sm" />
          </div>
        </>
      )}
    </div>
  );
};

const Options = ({
  presId,
  title,
  setTitle,
}: {
  presId: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const {userPresentations, setUserPresentations} = useUserData()!;

  const [open, setOpen] = useState(false);

  const {currentUser, unSubscribedUserId} = useAuth()!;
  const deletePresentation = async () => {
    await deleteDoc(doc(db, "presentations", presId));

    const updatedPresentations = userPresentations.filter(
      (pres) => pres.id !== presId
    );
    const updatedPresentationsIds = updatedPresentations.map((pres) => pres.id);
    console.log("b", updatedPresentations.length);
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        presentations: updatedPresentationsIds,
      });
      setUserPresentations(updatedPresentations);
    } else if (unSubscribedUserId) {
      await updateDoc(doc(db, "users", unSubscribedUserId), {
        presentations: updatedPresentationsIds,
      });
      setUserPresentations(updatedPresentations);
    }
  };
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = () => {
    // copy current url to clipboard
    navigator.clipboard.writeText(
      window.location.href.split("/dashboard")[0] + "/presentation/" + presId
    );
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const showDeleteDialogToggle = (openState: boolean) => {
    setShowDeleteDialog(openState);
    setOpen(true);
  };

  const showRenameDialogToggle = (openState: boolean) => {
    setShowRenameDialog(openState);
    setOpen(true);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="relative z-[40] w-fit hover:bg-muted rounded-full p-1 aspect-square flex items-center justify-center">
          <Icons.ellipsis className="w-6 h-6 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <Button
            onClick={() => setShowRenameDialog(true)}
            variant={"ghost"}
            className=" flex items-center gap-2 justify-start w-full"
          >
            <Icons.pencil className="w-4 h-4 " />
            Rename
          </Button>
          <Button
            onClick={copyLink}
            variant={"ghost"}
            className=" flex items-center justify-start gap-2 w-full"
          >
            {isCopied ? (
              <>
                <Icons.check className="w-4 h-4 " />
                Link Copied!
              </>
            ) : (
              <>
                <Icons.link style={{height: 16, width: 16}} />
                Copy Link
              </>
            )}
          </Button>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={showDeleteDialogToggle}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                className="text-theme-red hover:text-theme-red flex items-center justify-start gap-2 w-full"
              >
                <Icons.trash className="w-4 h-4 text-theme-red" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure your want to delete this presentation?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your presentation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deletePresentation();
                    setShowDeleteDialog(false);
                  }}
                  className="bg-theme-red hover:bg-theme-red/80 gap-1"
                >
                  <Icons.trash className="w-4 h-4 " />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameDialog
        presId={presId}
        name={title}
        setName={setTitle}
        showRenameDialog={showRenameDialog}
        setShowRenameDialog={showRenameDialogToggle}
      />
    </>
  );
};

const RenameDialog = ({
  presId,
  name,
  setName,
  showRenameDialog,
  setShowRenameDialog,
}: {
  presId: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string | undefined>>;
  showRenameDialog: boolean;
  setShowRenameDialog: (openState: boolean) => void;
}) => {
  const renamePresentation = async () => {
    await updateDoc(doc(db, "presentations", presId), {
      title: name,
    });
    setShowRenameDialog(false);
  };

  return (
    <>
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl poppins-bold ">
              Rename your presentation
            </DialogTitle>
          </DialogHeader>
          <input
            disabled={false}
            type="text"
            autoFocus
            placeholder="Presentation name"
            value={name}
            className="border p-2 relative hover:border-primary z-[99] rounded-md shadow-md "
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <DialogFooter className="">
            <DialogClose type="submit">
              <Button variant="ghost">cancel</Button>
            </DialogClose>
            <Button onClick={renamePresentation} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
