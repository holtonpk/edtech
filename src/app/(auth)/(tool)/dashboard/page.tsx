"use client";
import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {useAuth} from "@/context/user-auth";
import {useSidebar} from "@/components/ui/sidebar";
import Settings from "./settings";
import Presentations from "./presentations";
import Uploads from "./uploads";
import AuthModal from "@/components/auth/auth-modal";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {FullSlideData, UploadTypeServer} from "@/config/data";

interface UserContextType {
  userPresentations: FullSlideData[];
  setUserPresentations: React.Dispatch<React.SetStateAction<FullSlideData[]>>;
  userUploads: UploadTypeServer[];
  setUserUploads: React.Dispatch<React.SetStateAction<UploadTypeServer[]>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider component
export const UserDataProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [userPresentations, setUserPresentations] = useState<FullSlideData[]>(
    []
  );
  const [userUploads, setUserUploads] = useState<UploadTypeServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {currentUser, unSubscribedUserId, rerender} = useAuth()!;

  const fetchPresentations = async (presentations: string[]) => {
    if (!presentations) return [];
    const presentationData = await Promise.all(
      presentations.map(async (presentationId) => {
        const presentationRef = doc(db, "presentations", presentationId);
        const presentationSnap = await getDoc(presentationRef);
        return presentationSnap.data();
      })
    );
    setUserPresentations(presentationData as FullSlideData[]);
  };

  const fetchUploads = async (uploads: string[]) => {
    if (!uploads) return [];
    const uploadData = await Promise.all(
      uploads.map(async (uploadId) => {
        const uploadRef = doc(db, "uploads", uploadId);
        const uploadSnap = await getDoc(uploadRef);
        return uploadSnap.data();
      })
    );
    setUserUploads(uploadData as UploadTypeServer[]);
  };

  const fetchUserData = async (userId: string) => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const {presentations, uploads} = userSnap.data();
      await fetchPresentations(presentations);
      await fetchUploads(uploads);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userId = currentUser?.uid || unSubscribedUserId;
    if (userId) {
      fetchUserData(userId);
    }
  }, [currentUser, unSubscribedUserId, rerender]);

  const values = {
    userPresentations,
    setUserPresentations,
    userUploads,
    setUserUploads,
    isLoading,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

// Custom hook to access user context
export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

const Dashboard = () => {
  const {open} = useSidebar();

  const [view, setView] = useState<string>(); // Default view

  useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash.replace("#", "") || "presentations");
    };

    // Set the initial view based on the current hash
    handleHashChange();

    // Add event listener for hash change
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  // const [userPresentations, setUserPresentations] = useState<FullSlideData[]>(
  //   []
  // );
  // const [userUploads, setUserUploads] = useState<UploadTypeServer[]>([]);

  // const [isLoading, setIsLoading] = useState(true);

  // const fetchPresentations = async (presentations: string[]) => {
  //   if (!presentations) return [];
  //   const presentationData = await Promise.all(
  //     presentations.map(async (presentationId) => {
  //       const presentationRef = doc(db, "presentations", presentationId);
  //       const presentationSnap = await getDoc(presentationRef);
  //       return presentationSnap.data();
  //     })
  //   );
  //   setUserPresentations(presentationData as FullSlideData[]);
  // };

  // const fetchUploads = async (uploads: string[]) => {
  //   if (!uploads) return [];
  //   const uploadData = await Promise.all(
  //     uploads.map(async (uploadId) => {
  //       const uploadRef = doc(db, "uploads", uploadId);
  //       const uploadSnap = await getDoc(uploadRef);
  //       return uploadSnap.data();
  //     })
  //   );
  //   setUserUploads(uploadData as UploadTypeServer[]);
  // };

  // useEffect(() => {
  //   const fetchUserData = async (userId: string) => {
  //     if (!userId) return;
  //     const userRef = doc(db, "users", userId);
  //     const userSnap = await getDoc(userRef);
  //     if (userSnap.exists()) {
  //       const {presentations, uploads} = userSnap.data();
  //       await fetchPresentations(presentations);
  //       await fetchUploads(uploads);
  //       setIsLoading(false);
  //     }
  //   };

  //   if (currentUser?.uid) {
  //     fetchUserData(currentUser.uid);
  //   } else if (unSubscribedUserId) {
  //     fetchUserData(unSubscribedUserId);
  //   }
  // }, [currentUser, unSubscribedUserId]);

  return (
    <div
      className={` flex flex-col transition-[width] ease-linear p-8 pt-4  gap-4
    ${open ? "w-[calc(100vw-13rem)]" : "w-[calc(100vw-3rem)]"}
    
    `}
    >
      <AuthModal />
      <UserDataProvider>
        {view === "presentations" && <Presentations />}
        {view === "uploads" && <Uploads />}
      </UserDataProvider>
      {view === "settings" && <Settings />}
    </div>
  );
};

export default Dashboard;

export const NavBar = () => {
  return (
    <div className="flex w-fit gap-4 poppins-bold text-muted-foreground">
      <a>About</a>
      <a>Learn</a>
      <a>Share</a>
    </div>
  );
};
