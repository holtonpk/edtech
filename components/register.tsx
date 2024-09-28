"use client";
import React, {EventHandler, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {createUserSchema} from "@/lib/validations/auth";
// import {useForm} from "react-hook-form";
// import {toast} from "@/components/ui/use-toast";
import * as z from "zod";
import {useAuth} from "@/context/user-auth";
// import {PasswordInput} from "@/components/ui/password-input";
import {Icons} from "@/components/icons";
import {useRouter} from "next/navigation";
// import {Logo} from "@/components/icons";
// import Background from "../background";
import {LucideProps} from "lucide-react";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const {logInWithGoogle, setShowLoginModal} = useAuth()!;
  // type FormData = z.infer<typeof createUserSchema>;
  const router = useRouter();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: {errors},
  //   setError,
  // } = useForm<FormData>({
  //   resolver: zodResolver(createUserSchema),
  // });

  async function googleSingIn(): Promise<void> {
    try {
      setIsGoogleLoading(true);
      const createAccountResult = await logInWithGoogle();
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
    } finally {
      setIsGoogleLoading(false);
      setShowLoginModal(false);
    }
  }

  return (
    <div className="h-fit w-full  md:w-fit p-6 overflow-hidden md:border md:border-border md:rounded-2xl shadow-xl z-20 blurBack items-center flex flex-col ">
      <div className="flex items-center"></div>
      {/* <h1 className="text-2xl md:text-4xl font-semibold text-background dark font1 text-center mt-4">
        Login to access
      </h1> */}
      <h1 className="text-2xl font-bold">Edtech tool</h1>

      <Button
        onClick={googleSingIn}
        type="button"
        className="w-full bg-card hover:bg-opacity-60 text-primary  dark:border-none border mt-4"
        variant="outline"
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleLogo className=" h-6 w-6 mr-2" />
        )}
        Log in with Google
      </Button>
    </div>
  );
};

export default RegisterForm;

const GoogleLogo = ({...props}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="705.6"
    height="720"
    viewBox="0 0 186.69 190.5"
    {...props}
  >
    <path
      fill="#4285f4"
      d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
      transform="translate(1184.583 765.171)"
    ></path>
    <path
      fill="#34a853"
      d="M-1142.714-651.791l-6.972 5.337-24.679 19.223c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
      transform="translate(1184.583 765.171)"
    ></path>
    <path
      fill="#fbbc05"
      d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
      transform="translate(1184.583 765.171)"
    ></path>
    <path
      fill="#ea4335"
      d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
      transform="translate(1184.583 765.171)"
    ></path>
  </svg>
);
