"use client";
import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useRef,
} from "react";

// import nookies from "nookies";
import {
  User as FirebaseUser,
  signOut,
  GoogleAuthProvider,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

import {doc, setDoc, getDoc} from "firebase/firestore";
import {db, auth, app} from "@/config/firebase";
import {set} from "zod";
// import {Notifications, CompletedVideo, PayoutLocation} from "@/config/data";

interface AuthContextType {
  currentUser: UserData | undefined;
  logInWithGoogle: () => Promise<any>;
  logOut: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const emailRef = React.createRef();

export function useAuth() {
  return useContext(AuthContext);
}

export interface UserData extends FirebaseUser {
  firstName: string;
  lastName: string;
  photoURL: string;
  presentations: string[];
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<UserData | undefined>(
    undefined
  );

  const [unSubscribedUserId, setUnSubscribedUserId] = useState<string | null>(
    null
  );

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(true);

  // useEffect(() => {
  //   if (!currentUser) {
  //     if (localStorage.getItem("unSubscribedUserId"))
  //       setUnSubscribedUserId(
  //         localStorage.getItem("unSubscribedUserId") as string
  //       );
  //     else {
  //       const uId = Math.random().toString(36).substring(2, 14);
  //       localStorage.setItem("unSubscribedUserId", uId);
  //       setUnSubscribedUserId(uId);
  //     }
  //   }
  // }, [rerender, currentUser]);

  async function logOut() {
    try {
      await signOut(auth);
      setCurrentUser(undefined);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async function logInWithGoogle(): Promise<{success?: any; error?: any}> {
    try {
      const result = await signInWithPopup(
        auth,
        new GoogleAuthProvider().setCustomParameters({prompt: "select_account"})
      );
      if (result.user) {
        createUserStorage(
          result.user.uid,
          {
            first: result.user?.displayName?.split(" ")[0] || "",
            last: result.user?.displayName?.split(" ")[1] || "",
          },
          result.user.email || "",
          result.user.photoURL || undefined
        );
        return {success: result};
      } else {
        return {error: result};
      }
    } catch (error: any) {
      return {error};
    }
  }

  const createUserStorage = async (
    uid: string,
    name: {first: string; last: string},
    email: string,
    photoUrl?: string
  ) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName: name.first,
        lastName: name.last,
        email: email,
        photoURL: photoUrl,
        uid: uid,
        presentations: [],
        notificationSettings: {
          email: email,
          new_video: false,
          revision: false,
          done: false,
          notes: false,
        },
      });
    }

    if (!auth.currentUser?.displayName) {
      await updateProfile(auth.currentUser as FirebaseUser, {
        displayName: `${name.first} ${name.last}`,
      });
    }
  };

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     console.log("email ver ====", user?.emailVerified);
  //     if (user?.uid) {
  //       const token = await user.getIdToken();
  //       // nookies.set(undefined, "token", token, { path: "/" });
  //     }
  //     if (user) {
  //       if (user.emailVerified !== false) {
  //         const userRef = doc(db, "users", user.uid);

  //         const userSnap = await getDoc(userRef);
  //         const userData = userSnap.data();
  //         await auth.currentUser?.getIdToken(true);
  //         const decodedToken = await auth.currentUser?.getIdTokenResult();
  //         setCurrentUser({
  //           ...user,
  //           firstName: userData?.firstName,
  //           lastName: userData?.lastName,
  //           photoURL: userData?.photoURL,
  //           presentations: userData?.presentations,
  //         });
  //       }
  //     } else {
  //       setRerender(true);
  //     }
  //     setLoading(false);
  //   });
  //   return unsubscribe;
  // }, []);

  async function getUserData() {
    const userRef = doc(db, "users", "TrxCwQISFwc6ETvPYREqpgWdseg2");

    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    setCurrentUser({
      ...userData,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      photoURL: userData?.photoURL,
      presentations: userData?.presentations,
    } as UserData);
  }

  useEffect(() => {
    if (!currentUser) {
      getUserData();
      setRerender(false);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    logInWithGoogle,
    logOut,
    showLoginModal,
    setShowLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
