"use client";

import React, {useState, useRef, useEffect} from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {LinkButton} from "@/components/ui/link";
import {useAuth} from "@/context/user-auth";
import {db, app} from "@/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {UploadTypeServer} from "@/config/data";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {formatTimeDifference} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";
import {useUserData} from "../page";

const UserUploads = () => {
  const {userUploads, setUserUploads} = useUserData()!;

  return (
    <div>
      {userUploads && userUploads.length > 0 ? (
        <PresentationTable />
      ) : (
        <div className=" w-full flex pt-20   h-[calc(100vh-80px)]">
          <LinkButton
            href="/create"
            className="w-fit hover:bg-background p-0 group hover:rotate-[-.5deg] hover:scale-[105%] transition-transform duration-300 shadow-lg overflow-hidden mx-auto rounded-md h-fit flex items-center justify-center flex-col gap-3 bg-background border "
          >
            {/* <Icons.sad className="w-12 h-12 text-muted-foreground" /> */}
            <Icons.uploadsIll className="w-[400px]  " />
            <div className="flex flex-col p-8 pb-4 pt-0 gap-3 items-center">
              <div className="grid gap-1">
                <h1 className=" text-xl poppins-bold text-black text-center">
                  You don&apos;t have any uploads
                </h1>
                <p className="text-muted-foreground text-sm text-center">
                  Upload Youtube videos, PDF’s, Images and more
                </p>
              </div>
              <div className="justify-center w-fit border rounded-md flex gap-1 items-center text-left group bg-theme-purple text-white py-2 shadow-lg text-primary px-4  transition-all duration-300 text-white">
                Create a new project
                <Icons.chevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </LinkButton>
        </div>
      )}
    </div>
  );
};

export default UserUploads;

const PresentationTable = () => {
  const {userUploads, setUserUploads} = useUserData()!;

  const sortPresentationsByDateDesc = (presentations: UploadTypeServer[]) => {
    return presentations.sort((a, b) => {
      const dateA = (a.createdAt as Timestamp).toMillis();
      const dateB = (b.createdAt as Timestamp).toMillis();
      return dateB - dateA;
    });
  };

  const sortedUserUploads = sortPresentationsByDateDesc(userUploads);
  return (
    <Table className="h-fit ">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Uploaded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-fit">
        {sortedUserUploads.map((upload) => (
          <PresTableRow key={upload.id} upload={upload} />
        ))}
      </TableBody>
    </Table>
  );
};

const PresTableRow = ({upload}: {upload: UploadTypeServer}) => {
  const [title, setTitle] = useState<string>(upload.title);
  const {userUploads, setUserUploads} = useUserData()!;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const docRef = doc(db, "uploads", uploadId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setTitle(docSnap.data().title);
  //       setUpload(docSnap.data() as UploadTypeServer);
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   };

  //   if (!dataIsFetched.current) {
  //     fetchData();
  //     dataIsFetched.current = true;
  //   }
  // }, [uploadId]);

  const renderIcon = () => {
    switch (upload && upload.type) {
      case "pdf":
      case "doc":
      case "docx":
        return <Icons.pdf className=" w-5 h-5 text-primary " />;

      case "mp4":
        return <Icons.vid className=" w-5 h-5 text-primary " />;

      case "jpg":
      case "jpeg":
      case "png":
        return <Icons.img className=" w-5 h-5 text-primary " />;

      case "mp3":
        return <Icons.audio className=" w-5 h-5 text-primary " />;

      case "youtube":
        return <Icons.Youtube className=" w-5 h-5 " />;

      default:
        return <Icons.file className=" w-5 h-5 text-primary " />;
    }
  };

  return (
    <TableRow className="relative overflow-hidden poppins-regular">
      {/* <button className="absolute w-full h-full  z-10 bgs-red-600"></button> */}

      <TableCell className=" z-30 relative font-medium max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap grid grid-cols-[20px_1fr] items-center gap-2">
        {renderIcon()}
        <a
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-primary poppins-regular"
          href={upload && upload.path}
          target="_blank"
        >
          {title}
        </a>
      </TableCell>
      <TableCell>{upload?.type}</TableCell>
      <TableCell>{upload && formatTimeDifference(upload.createdAt)}</TableCell>
      <TableCell className="relative z-20">
        {upload && <Options uploadId={upload.id} path={upload.path} />}
      </TableCell>
    </TableRow>
  );
};

const Options = ({uploadId, path}: {uploadId: string; path: string}) => {
  const {userUploads, setUserUploads} = useUserData()!;

  const {currentUser, unSubscribedUserId} = useAuth()!;
  const deletePresentation = async () => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "uploads", uploadId));
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();

      await setDoc(
        userDocRef,
        {
          uploads: [
            ...(userData.uploads || []).filter(
              (upload: any) => upload !== uploadId
            ),
          ],
        },
        {merge: true}
      );
    }
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (e) {
      console.log(e);
    }
    const updatedUploads = userUploads.filter(
      (upload) => upload.id !== uploadId
    );
    const updatedUploadsIds = updatedUploads.map((pres) => pres.id);
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        uploads: updatedUploadsIds,
      });
      setUserUploads(updatedUploads);
    } else if (unSubscribedUserId) {
      await updateDoc(doc(db, "users", unSubscribedUserId), {
        uploads: updatedUploadsIds,
      });
    }
    setUserUploads(updatedUploads);
  };

  const [open, setOpen] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  const showDeleteDialogToggle = (openState: boolean) => {
    setShowDeleteDialog(openState);
    setOpen(true);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="relative z-[40] w-fit hover:bg-muted rounded-full p-1 aspect-square flex items-center justify-center">
          <Icons.ellipsis className="w-6 h-6 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <LinkButton
            target="_blank"
            href={path}
            variant={"ghost"}
            className=" flex items-center gap-2 justify-start w-full"
          >
            View
          </LinkButton>

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
    </>
  );
};
