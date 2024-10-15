"use client";
import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useRef,
} from "react";
import {
  User as FirebaseUser,
  signOut,
  GoogleAuthProvider,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {db, auth} from "@/config/firebase";

interface AuthContextType {
  currentUser: UserData | undefined;
  logInWithGoogle: () => Promise<any>;
  logOut: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  saveFileToGoogleDrive: (
    fileBlob: Blob,
    fileName: string
  ) => Promise<{success?: boolean; error?: boolean; data?: any}>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export interface UserData extends FirebaseUser {
  firstName: string;
  lastName: string;
  photoURL: string;
  presentations: string[];
  googleToken?: string;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<UserData | undefined>(
    undefined
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function logOut() {
    try {
      await signOut(auth);
      setCurrentUser(undefined);
      setAccessToken(null); // Reset accessToken on logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async function logInWithGoogle(): Promise<{success?: any; error?: any}> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/drive.file"); // Add Google Drive scope

      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken; // This is the OAuth access token

        createUserStorage(
          result.user.uid,
          {
            first: result.user?.displayName?.split(" ")[0] || "",
            last: result.user?.displayName?.split(" ")[1] || "",
          },
          result.user.email || "",
          result.user.photoURL || undefined,
          token
        );
        return {success: result};
      } else {
        return {error: result};
      }
    } catch (error: any) {
      return {error};
    }
  }

  async function saveFileToGoogleDrive(fileBlob: Blob, fileName: string) {
    const fileMetadata = {
      name: fileName,
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // MIME type for .pptx
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(fileMetadata)], {type: "application/json"})
    );
    form.append("file", fileBlob); // Append the .pptx blob file here

    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${currentUser?.googleToken}`,
          }),
          body: form,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error saving file to Google Drive:", errorResponse);
        return {
          error: true,
        };
      }

      const file = await response.json();

      return {
        success: true,
        data: file,
      };
    } catch (error) {
      console.error("Error uploading file to Google Drive:", error);
      return {
        error: true,
      };
    }
  }

  const createUserStorage = async (
    uid: string,
    name: {first: string; last: string},
    email: string,
    photoUrl?: string,
    googleToken?: string
  ) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (googleToken && userSnap.exists()) {
      await setDoc(
        userRef,
        {
          googleToken: googleToken,
        },
        {merge: true}
      );
    }

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName: name.first,
        lastName: name.last,
        email: email,
        photoURL: photoUrl,
        uid: uid,
        presentations: [],
        googleToken: googleToken,
      });
    }

    if (!auth.currentUser?.displayName) {
      await updateProfile(auth.currentUser as FirebaseUser, {
        displayName: `${name.first} ${name.last}`,
      });
    }
  };

  // New effect to get access token for already signed-in users
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        const credential = GoogleAuthProvider.credentialFromResult({
          user,
        } as any);

        // If the credential doesn't provide the access token, use getIdTokenResult
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims && tokenResult.token) {
          const providerData = user.providerData.find(
            (provider) => provider.providerId === "google.com"
          );
          if (providerData) {
            const googleToken =
              tokenResult.claims.firebase?.sign_in_provider === "google.com"
                ? tokenResult.token
                : null;
            if (googleToken) {
              setAccessToken(googleToken);
            }
          }
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (userData) {
          setCurrentUser({
            ...user,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            photoURL: userData?.photoURL,
            presentations: userData?.presentations,
            googleToken: userData?.googleToken || undefined,
          });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    logInWithGoogle,
    logOut,
    showLoginModal,
    setShowLoginModal,
    saveFileToGoogleDrive,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
