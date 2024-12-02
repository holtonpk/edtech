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
        return {...presentationSnap.data(), id: presentationId};
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

  console.log("presentations", userPresentations);

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
