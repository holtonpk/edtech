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
  updatePassword,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  sendPasswordResetEmail,
  deleteUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {db, auth} from "@/config/firebase";
import emailjs from "@emailjs/browser";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
// import {google} from "googleapis";
interface DeleteAccountResponse {
  success?: string;
  error?: string;
}
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
  checkUserAccessScopes: (scope: string) => Promise<boolean>;
  userPresentations: string[];
  setUserPresentations: React.Dispatch<React.SetStateAction<string[]>>;
  userUploads: string[];
  setUserUploads: React.Dispatch<React.SetStateAction<string[]>>;
  changeUserEmail: (currentPassword: string, newEmail: string) => any;
  changeUserDisplayName: (newDisplayName: string) => any;
  uploadProfilePicture: (file: File) => any;
  changeProfilePicture: (url: string) => any;
  changeUserPassword: (currentPassword: string, newPassword: string) => any;
  resetPassword: () => any;
  DeleteAccount: () => Promise<DeleteAccountResponse>;
  signIn: (email: string, password: string) => any;
  VerifyEmail: (code: string, uId: string) => any;
  sendVerificationEmail: (to_name: string, to_email: string) => any;
  resendVerificationEmail: () => Promise<void>;
  createUserStorage: (
    uid: string,
    name?: {first: string; last: string},
    email?: string,
    photoUrl?: string,
    googleToken?: string
  ) => Promise<void>;
  createAccount: (
    email: string,
    name: {first: string; last: string},
    password: string
  ) => Promise<{success: boolean; user?: FirebaseUser; error?: string}>;
  newUser: boolean;
  setNewUser: (value: boolean) => void;
  showEmailVerificationModal: boolean;
  setShowEmailVerificationModal: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  unSubscribedUserId: string | undefined;
  setUnSubscribedUserId: (value: string | undefined) => void;
  rerender: boolean;
  getGoogleAccessToken: (
    scope: string,
    cancelFunction?: () => void
  ) => Promise<string>;
  googleDriveTokenRef: React.MutableRefObject<string | null>;
  googleDriveFileTokenRef: React.MutableRefObject<string | null>;
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
  uploads: string[];
  unSubUserId?: string;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<UserData | undefined>(
    undefined
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const [newUser, setNewUser] = React.useState(true);
  const [userPresentations, setUserPresentations] = useState<string[]>([]);
  const [userUploads, setUserUploads] = useState<string[]>([]);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [email, setEmail] = useState("");
  const [unSubscribedUserId, setUnSubscribedUserId] = useState<
    string | undefined
  >();

  // token for scope https://www.googleapis.com/auth/drive
  const googleDriveTokenRef = useRef<string | null>(null);
  // token for scope https://www.googleapis.com/auth/drive.file
  const googleDriveFileTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchUserData = (userId: string) => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);

      // Set up the real-time listener
      const unsubscribe = onSnapshot(userRef, (userSnap) => {
        if (userSnap.exists()) {
          const {
            presentations,
            uploads,
            googleDriveToken,
            googleDriveFileToken,
          } = userSnap.data();
          setUserPresentations(presentations);
          setUserUploads(uploads);
          googleDriveFileTokenRef.current = googleDriveFileToken;
          googleDriveTokenRef.current = googleDriveToken;
        }
      });

      // Return the unsubscribe function to stop listening
      return unsubscribe;
    };

    let unsubscribeCurrentUser = null;
    let unsubscribeUnsubscribedUser = null;

    // Set up listeners based on the current user or unsubscribed user
    if (currentUser?.uid) {
      unsubscribeCurrentUser = fetchUserData(currentUser.uid);
    } else if (unSubscribedUserId) {
      unsubscribeUnsubscribedUser = fetchUserData(unSubscribedUserId);
    }

    // Clean up listeners on component unmount or when dependencies change
    return () => {
      if (unsubscribeCurrentUser) unsubscribeCurrentUser();
      if (unsubscribeUnsubscribedUser) unsubscribeUnsubscribedUser();
    };
  }, [currentUser, unSubscribedUserId]);

  const [rerender, setRerender] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("unSubscribedUserId")) {
        setUnSubscribedUserId(
          localStorage.getItem("unSubscribedUserId") as string
        );
        const userDoc = doc(
          db,
          "users",
          localStorage.getItem("unSubscribedUserId") as string
        );
        getDoc(userDoc).then((snap) => {
          if (!snap.exists()) {
            createUserStorage(
              localStorage.getItem("unSubscribedUserId") as string
            );
            setRerender(!rerender);
          }
        });
      } else {
        const uId = Math.random().toString(36).substring(2, 14);
        localStorage.setItem("unSubscribedUserId", uId);
        setUnSubscribedUserId(uId);
        createUserStorage(uId);
        setRerender(!rerender);
      }
    }
  }, [currentUser]);

  async function logOut() {
    try {
      await signOut(auth);
      setCurrentUser(undefined);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async function signIn(email: string, password: string) {
    const login = signInWithEmailAndPassword(auth, email, password)
      .then((value: any) => {
        CopyUserDataFromUnSubToSub(value.user.uid);
      })
      .then(() => {
        return {success: true};
      })
      .catch((error: any) => {
        return {error: error.code};
      });
    return login;
  }

  const verifyCode = useRef<string>(
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  async function createAccount(
    email: string,
    name: {first: string; last: string},
    password: string
  ): Promise<{success: boolean; user?: FirebaseUser; error?: string}> {
    try {
      const account = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserStorage(account?.user.uid, name, email);
      await CopyUserDataFromUnSubToSub(account?.user.uid);
      return {success: true, user: account.user};
    } catch (error: any) {
      console.error("Error creating account:", error);
      return {error: error.code, success: false};
    }
  }

  async function CopyUserDataFromUnSubToSub(newUserId: string) {
    console.log("copting to unSubscribedUserId", newUserId);
    if (!unSubscribedUserId) return;
    const unSubscribedUserRef = doc(db, "users", unSubscribedUserId);
    const unSubscribedUserSnap = await getDoc(unSubscribedUserRef);
    if (!unSubscribedUserSnap.exists()) return;
    const {presentations, uploads} = unSubscribedUserSnap.data();
    const userRef = doc(db, "users", newUserId);
    try {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      await setDoc(
        userRef,
        {
          presentations: [
            ...(presentations || []),
            ...(userData?.presentations || []),
          ],
          uploads: [...(uploads || []), ...(userData?.uploads || [])],
          unSubUserId: unSubscribedUserId,
        },
        {merge: true}
      );
    } catch (e) {
      console.log("error $$$$$$$$$", e);
    }
    await deleteDoc(unSubscribedUserRef);
  }

  async function VerifyEmail(code: string, uId: string) {
    // if (code !== verifyCode.current) {
    //   return "error";
    // }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uId,
        }),
      });
      const data = await response.json();

      if (data.success) {
        console.log("successs");
        await CreateCurrentUser();
        return "success";
      } else {
        return "error";
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      return "error";
    }
  }

  async function resendVerificationEmail() {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    // setVerifyCode(newCode);
    verifyCode.current = newCode;

    await emailjs.send(
      "service_78m74ru",
      "template_uyczd6a",
      {
        to_name: auth.currentUser?.displayName,
        code: newCode,
        to_email: auth.currentUser?.email,
      },
      "_xxtFZFU5RPJivl-9"
    );
  }

  async function sendVerificationEmail(to_name: string, to_email: string) {
    try {
      await emailjs.send(
        "service_78m74ru",
        "template_uyczd6a",
        {
          to_name,
          code: verifyCode.current,
          to_email,
        },
        "_xxtFZFU5RPJivl-9"
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  async function CreateCurrentUser() {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    await auth.currentUser?.getIdToken(true);
    setCurrentUser({
      ...user,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      photoURL: userData?.photoURL,
      presentations: userData?.presentations,
      googleToken: userData?.googleToken || undefined,
      uploads: userData?.uploads,
    });
  }

  async function logInWithGoogle(): Promise<{success?: any; error?: any}> {
    try {
      const provider = new GoogleAuthProvider();
      // provider.addScope("https://www.googleapis.com/auth/drive.file");
      // provider.addScope("https://www.googleapis.com/auth/docs");
      // provider.addScope("https://www.googleapis.com/auth/drive"); // Add Google Drive scope
      // Add Google Drive scope
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        console.log("result===============", result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken; // This is the OAuth access token
        console.log("token===============", token);
        if (token) {
          accessTokenRef.current = token;
        }

        await createUserStorage(
          result.user.uid,
          {
            first: result.user?.displayName?.split(" ")[0] || "",
            last: result.user?.displayName?.split(" ")[1] || "",
          },
          result.user.email || "",
          result.user.photoURL || undefined,
          token
        );
        console.log("new id===============", result.user.uid);
        await CopyUserDataFromUnSubToSub(result.user.uid);
        return {success: result};
      } else {
        return {error: result};
      }
    } catch (error: any) {
      return {error};
    }
  }

  async function getGoogleAccessToken(
    scope: string,
    cancelFunction?: () => void
  ): Promise<string> {
    const clientId =
      "531390591850-cki12ma1v3o5ktjk3u5d1qg8bnliksk9.apps.googleusercontent.com";
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/google-redirect`;

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&prompt=consent`;

    // Open a popup for OAuth
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "Google OAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Monitor the popup for token response
    return await new Promise((resolve, reject) => {
      const pollTimer = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(pollTimer);
            cancelFunction && cancelFunction();
            reject("Popup closed by user");
          } else if (popup) {
            const url = popup.location.href;
            if (url.includes("access_token")) {
              clearInterval(pollTimer);

              // Extract the access token from the URL
              const params = new URL(url).hash.substring(1);
              const token = new URLSearchParams(params).get("access_token");

              if (token) {
                popup.close();
                saveGoogleTokenToUser(token, scope);
                resolve(token);
              } else {
                reject("Failed to retrieve access token");
              }
            }
          }
        } catch (error) {
          // Ignore cross-origin errors until popup redirects to the same origin
        }
      }, 500);
    });
  }

  const saveGoogleTokenToUser = async (token: string, scope: string) => {
    let userRef;
    if (currentUser) {
      userRef = doc(db, "users", currentUser.uid);
    } else if (unSubscribedUserId) {
      userRef = doc(db, "users", unSubscribedUserId);
    }
    if (!userRef) return;
    let data = null;

    if (scope === "https://www.googleapis.com/auth/drive.file") {
      data = {
        googleDriveFileToken: token,
      };
      googleDriveFileTokenRef.current = token;
    } else if (scope === "https://www.googleapis.com/auth/drive") {
      data = {
        googleDriveToken: token,
      };
      googleDriveTokenRef.current = token;
    }
    if (!data) return;
    await updateDoc(userRef, {
      ...data,
    });
  };

  const checkUserAccessScopes = async (scope: string) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessTokenRef.current}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("Error checking user access scopes:", response);
      return false;
    }
    const data = await response.json();
    const scopes = data.scope.split(" ");
    if (scopes.includes(scope)) {
      return true;
    } else {
      return false;
    }
  };

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
    // const token =
    //   "ya29.a0AcM612wlf41ImWyZbYqsTTlntsTdE2NfDa8YIR971MDZ5qnp5WXckWoxqZnOW-50HapiWnpD4tkgYwmO4yoYTslysiEOxbvgE9TaVMQmxA0dOcFnYoh2YLzlsqBu9qj-Zj0WmqJ3tnzPrdIsV3bE_dQHw1QC_n1JZnkvHpEPaCgYKAbASARESFQHGX2MiJABwkk-aJjuOJKW1aA2_8A0175";
    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${accessTokenRef.current}`,
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
    name?: {first: string; last: string},
    email?: string,
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
        firstName: (name && name.first) || "",
        lastName: (name && name.last) || "",
        email: email || "",
        photoURL: photoUrl || "",
        uid: uid,
        presentations: [],
        googleToken: googleToken || "",
      });
    }

    if (!auth.currentUser?.displayName && name) {
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
            }
          }
        }
        if (user) {
          if (user.emailVerified !== false) {
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
                uploads: userData?.uploads,
              });
              userData?.googleToken &&
                (accessTokenRef.current = userData?.googleToken);
            }
          }
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function changeUserEmail(newEmail: string, currentPassword: string) {
    if (!currentUser) return {error: "No user is signed in"};
    // Re-authenticate the user

    const credential = EmailAuthProvider.credential(
      currentUser.email as string,
      currentPassword
    );

    try {
      try {
        if (!auth.currentUser) return {error: "No user is currently signed in"};
        await reauthenticateWithCredential(auth.currentUser, credential);
      } catch (error) {
        console.log("error", error);
        return {error: "Current password is incorrect"};
      }

      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      // Change the email
      return {success: "Email updated successfully"};
    } catch (error) {
      return {error: error};
    }
  }

  async function changeUserDisplayName(newDisplayName: string) {
    if (!auth.currentUser || !currentUser)
      return {error: "No user is signed in"};
    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        firstName: newDisplayName.split(" ")[0],
        lastName: newDisplayName.split(" ")[1],
      });
      return {success: "Display name updated successfully"};
    } catch (error) {
      return {error: error};
    }
  }

  const uploadProfilePicture = async (file: any) => {
    if (!currentUser) return;
    const storage = getStorage();
    const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
    // Create a upload task
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: "image/jpeg", // Manually set the MIME type
    });

    // Create a promise to handle the upload task
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // You may want to use these to provide feedback to the user
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed", error);
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  };

  const changeProfilePicture = async (url: string) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      photoURL: url,
    });
    // updateProfile(firebaseUser, {
    //   photoURL: url,
    // });
  };

  async function changeUserPassword(
    currentPassword: string,
    newPassword: string
  ) {
    if (!auth.currentUser || !auth.currentUser.email) {
      return {error: "No user is currently signed in"};
    }

    // Create a credential
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    // Re-authenticate the user.
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      return {error: "Current password is incorrect"};
    }

    // Update the user's password.
    try {
      await updatePassword(auth.currentUser, newPassword);
      return {success: "Password updated successfully"};
    } catch (error) {
      return {error: "Error updating password: " + error};
    }
  }
  function resetPassword() {
    if (!currentUser || !currentUser.email)
      return {error: "No user is signed in"};
    const reset = sendPasswordResetEmail(auth, currentUser.email)
      .then((result) => {
        return "success";
      })
      .catch((error) => {
        console.log("error(((((", error);
        return error.code;
      });

    return reset;
  }

  const DeleteAccount = async (): Promise<DeleteAccountResponse> => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await deleteDoc(userRef);
        await deleteUser(auth.currentUser as FirebaseUser);
        return {success: "Account deleted successfully."};
      } catch (error) {
        return {success: "failed to delete account"};
      }
    } else {
      return {success: "failed to delete account"};
    }
  };

  const value = {
    currentUser,
    logInWithGoogle,
    logOut,
    showLoginModal,
    setShowLoginModal,
    saveFileToGoogleDrive,
    checkUserAccessScopes,
    userPresentations,
    setUserPresentations,
    changeUserEmail,
    changeUserDisplayName,
    uploadProfilePicture,
    changeProfilePicture,
    changeUserPassword,
    resetPassword,
    DeleteAccount,
    signIn,
    VerifyEmail,
    sendVerificationEmail,
    resendVerificationEmail,
    createAccount,
    newUser,
    setNewUser,
    showEmailVerificationModal,
    setShowEmailVerificationModal,
    email,
    setEmail,
    unSubscribedUserId,
    setUnSubscribedUserId,
    createUserStorage,
    userUploads,
    setUserUploads,
    rerender,
    getGoogleAccessToken,
    googleDriveTokenRef,
    googleDriveFileTokenRef,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
