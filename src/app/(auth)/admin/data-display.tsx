"use client";
import {Icons} from "@/components/icons";
import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {deleteUser} from "firebase/auth";
import {db} from "@/config/firebase";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import {UserData} from "@/context/user-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {FullSlideData, UploadTypeServer} from "@/config/data";

const DataDisplay = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, `users`));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        // Added async here
        const userData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            // Used Promise.all and added async here
            const data = doc.data();

            // const projectsQ = query(
            //   collection(db, `users/${data.uid}/projects`)
            // );

            // const projectSnapshot = await getDocs(projectsQ);
            // const projects = projectSnapshot.docs.map((doc) => doc.data());

            // const uploadsQ = query(
            //   collection(db, `users/${data.uid}/uploads`) // Corrected the path to uploads
            // );

            // const querySnapshot = await getDocs(uploadsQ);
            // const uploads = querySnapshot.docs.map((doc) => doc.data());

            return {
              ...data,
              // projects: projects,
              // uploads: uploads,
            };
          })
        );

        setData(userData);
        setFilteredData(userData);
        setLoading(false);
      });

      // Cleanup this component
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUser, setSelectedUser] = useState<UserData | undefined>();

  // const totalPdfs = data.reduce((acc, user) => {
  //   return (
  //     acc + user.uploads.filter((upload: any) => upload.type === "pdf").length
  //   );
  // }, 0);

  // const totalUrls = data.reduce((acc, user) => {
  //   return (
  //     acc + user.uploads.filter((upload: any) => upload.type === "url").length
  //   );
  // }, 0);

  // const totalYoutube = data.reduce((acc, user) => {
  //   return (
  //     acc +
  //     user.uploads.filter((upload: any) => upload.type === "youtube").length
  //   );
  // }, 0);

  const onSearch = (e: any) => {
    if (!e.target.value) {
      setFilteredData(data);
      return;
    }
    const value = e.target.value;
    const filtdData = data.filter((d) => {
      return (
        d.firstName.toLowerCase().includes(value.toLowerCase()) ||
        d.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtdData);
  };

  return (
    <div className="flex flex-col bg-background max-h-none h-screen w-screen dark ">
      <div className="flex gap-10 p-10 text-primary">
        <div className="border p-3 rounded-md text-xl w-fit justify-center items-center text-center text-theme-blue border-theme-blue font-bold">
          Total Users: {data.length === 0 ? "--" : data.length}
        </div>
      </div>
      <div className=" md:px-10 flex-grow text-primary grid md:grid-cols-[60%_40%] items-start pb-4 gap-6 ">
        <div className="flex flex-col gap-4">
          <div className="h-fit relative w-full bg-primary/5 rounded-md overflow-hidden">
            <Icons.search className="absolute top-1/2 left-2 -translate-y-1/2 text-primary/60 h-4 w-4" />
            <Input
              placeholder="find a user by name or email"
              className=" pl-7 bg-transparent"
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="border border-border rounded-lg w-full flex flex-col ">
            <div className="w-full grid grid-cols-4 px-6  p-2 bg-primary/5">
              {/* <div className="w-[350px]">id</div> */}
              <div className="w-full">Name</div>
              <div className="w-full">email</div>
              <div className="w-full flex justify-center">Presentations</div>
              <div className="w-full flex justify-center">Uploads</div>
            </div>
            <div className="h-[500px] w-full flex flex-col overflow-scroll ">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <Icons.spinner className="animate-spin h-10 w-10 " />
                </div>
              ) : (
                <>
                  {filteredData.map((d, i) => (
                    <UserRow
                      user={d}
                      selectedUser={selectedUser}
                      setSelectedUser={setSelectedUser}
                      key={i}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative flex-grow  h-full max-h-screen overflow-hidden">
          <SelectedUser user={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
      </div>
    </div>
  );
};

const UserRow = ({
  user,
  selectedUser,
  setSelectedUser,
}: {
  user: UserData;
  selectedUser: UserData | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}) => {
  //   const [userData, setUserData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (!user) return;
  //       const projectsQ = query(collection(db, `users/${user.uid}/projects`));

  //       const projectSnapshot = await getDocs(projectsQ);
  //       const projects = projectSnapshot.docs.map((doc) => doc.data());

  //       const uploadsQ = query(
  //         collection(db, `users/${user.uid}/uploads`) // Corrected the path to uploads
  //       );

  //       const querySnapshot = await getDocs(uploadsQ);
  //       const uploads = querySnapshot.docs.map((doc) => doc.data());
  //       setUserData({
  //         projects: projects,
  //         uploads: uploads,
  //       });
  //       setLoading(false);
  //     };

  //     fetchData();
  //   }, []);

  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`w-full grid grid-cols-4 px-6 border p-2 hover:bg-primary/5 cursor-pointer
                      ${
                        selectedUser && selectedUser.uid === user.uid
                          ? "bg-primary/10"
                          : ""
                      }
                      `}
    >
      <div className="w-full text-left w-full max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
        {user?.firstName + " " + user?.lastName || "not signed in"}
        {/* {user.uid} */}
      </div>
      <div className="w-full max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
        {user?.email || "not signed in"}
      </div>

      <div className="w-full flex justify-center">
        {user?.presentations
          ? user?.presentations.length === 0
            ? "--"
            : user?.presentations.length
          : "--"}
      </div>
      <div className="w-full flex justify-center">
        {user?.uploads
          ? user?.uploads.length === 0
            ? "--"
            : user?.uploads.length
          : "--"}
      </div>
    </div>
  );
};

export default DataDisplay;

const SelectedUser = ({
  user,
  setSelectedUser,
}: {
  user: UserData | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}) => {
  const [userData, setUserData] = useState<any>(null);

  //   useEffect(() => {
  //     if (selectedChat?.chat) {
  //       // scroll to the bottom of the chat container
  //       chatContainer.current?.scrollTo({
  //         top: chatContainer.current?.scrollHeight,
  //         behavior: "smooth",
  //       });
  //     }
  //   }, [selectedChat?.chat]);

  const [loading, setLoading] = useState(false);

  console.log("user", user);

  return (
    <div className="w-full border rounded-md p-4 h-full relative overflow-scroll   ">
      {!user ? (
        <div className="w-full h-full flex justify-center items-center">
          select a user to see their data
        </div>
      ) : (
        <>
          {loading ? (
            <div className="h-full w-full flex justify-center items-center">
              <Icons.spinner className="animate-spin h-10 w-10" />
            </div>
          ) : (
            <div className="grid gap-4">
              <DeleteUser user={user} setSelectedUser={setSelectedUser} />
              <div className="grid gap-1">
                <div className=" text-white">User ID</div>
                <h1>{user.uid}</h1>
              </div>
              <div className="grid gap-1">
                <div className=" text-white">Name</div>
                <h1>
                  {user?.firstName
                    ? user?.firstName + " " + user?.lastName
                    : "unsubscribed"}
                </h1>
              </div>
              {user.presentations ? (
                <div className="grid gap-1">
                  <h1 className="text-white">
                    Presentations ({user?.presentations.length})
                  </h1>
                  <div className="max-h-[200px] overflow-scroll">
                    <div className="flex flex-col gap-1 h-fit">
                      {user?.presentations &&
                        [...user?.presentations]
                          .reverse()
                          ?.map((presId) => (
                            <PresentationRow presId={presId} key={presId} />
                          ))}
                    </div>
                  </div>
                </div>
              ) : (
                <h1>No presentations</h1>
              )}
              {user?.uploads ? (
                <div className="grid gap-1">
                  <h1 className="text-white">
                    Uploads ({user?.uploads.length})
                  </h1>
                  <div className="max-h-[200px] overflow-scroll">
                    <div className="flex flex-col gap-1 h-fit">
                      {user?.uploads &&
                        [...user.uploads]
                          .reverse()
                          .map((uploadId) => (
                            <UploadRow uploadId={uploadId} key={uploadId} />
                          ))}
                    </div>
                  </div>
                </div>
              ) : (
                <h1>No uploads</h1>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PresentationRow = ({presId}: {presId: string}) => {
  const [presentationData, setPresentationData] = useState<FullSlideData>();

  useEffect(() => {
    const fetchData = async () => {
      const presentationRef = doc(db, "presentations", presId);
      const presentationSnap = await getDoc(presentationRef);
      if (presentationSnap.exists()) {
        setPresentationData(presentationSnap.data() as FullSlideData);
      }
    };
    fetchData();
  }, [presId]);

  return (
    <Link
      href={`/presentation/${presId}`}
      target="_blank"
      className="w-full grid grid-cols-[1fr_100px] rounded-sm px-2 border p-2 hover:bg-primary/5 cursor-pointer"
    >
      <div className="w-full text-left max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
        {presentationData?.title}
      </div>
      <span className="text-white whitespace-nowrap ml-auto">
        {presentationData?.createdAt &&
          formatTimeDifference(presentationData?.createdAt as Timestamp)}
      </span>
    </Link>
  );
};

const UploadRow = ({uploadId}: {uploadId: string}) => {
  const [uploadData, setUploadData] = useState<UploadTypeServer>();

  useEffect(() => {
    const fetchData = async () => {
      const uploadRef = doc(db, "uploads", uploadId);
      const uploadSnap = await getDoc(uploadRef);
      if (uploadSnap.exists()) {
        setUploadData(uploadSnap.data() as UploadTypeServer);
      }
    };
    fetchData();
  }, [uploadId]);

  return (
    <Link
      href={uploadData?.path || ""}
      target="_blank"
      className="w-full grid grid-cols-[1fr_100px] rounded-sm px-2 border p-2 hover:bg-primary/5 cursor-pointer"
    >
      <div className="w-full text-left max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
        {uploadData?.title}
      </div>
      <span className="text-white whitespace-nowrap ml-auto">
        {uploadData?.createdAt &&
          formatTimeDifference(uploadData?.createdAt as Timestamp)}
      </span>
    </Link>
  );
};

const DeleteUser = ({
  user,
  setSelectedUser,
}: {
  user: UserData | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
}) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!user) return;
    const userLocal = user;
    setLoading(true);
    toast({
      title: "User deleted",
      variant: "destructive",
    });
    await deleteDoc(doc(db, `users/${userLocal.uid}`));
    await deleteUser(userLocal);
    setSelectedUser(undefined);
    setLoading(false);
    setOpen(false);
    toast({
      title: "User deleted",
      variant: "destructive",
    });
  };

  return (
    <>
      <Button
        className="absolute w-fit right-4 top-4"
        onClick={() => setOpen(true)}
        variant={"destructive"}
      >
        Delete User
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="dark">
          <AlertDialogTitle className="text-white">
            Are you sure you want to delete this user?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel className="text-white">Cancel</AlertDialogCancel>
            <Button onClick={onDelete} className="" variant={"destructive"}>
              {loading && <Icons.spinner className="animate-spin h-5 w-5" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Function to calculate time difference and format it
const formatTimeDifference = (timestamp: Timestamp): string => {
  const now = new Date();
  const timestampDate = timestamp.toDate();
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHrs = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHrs / 24);
  const diffWeeks = Math.round(diffDays / 7);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} min`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hr${diffHrs === 1 ? "" : "s"}`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  } else {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"}`;
  }
};
