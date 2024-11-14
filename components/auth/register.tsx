"use client";
import React, {EventHandler, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {createUserSchema} from "@/lib/validations/auth";
import {useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast";
import * as z from "zod";
import {useAuth} from "@/context/user-auth";
import {PasswordInput} from "@/components/ui/password-input";
import {Icons} from "@/components/icons";
import {useRouter} from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const {
    createAccount,
    logInWithGoogle,
    setNewUser,
    setShowLoginModal,
    sendVerificationEmail,
  } = useAuth()!;
  type FormData = z.infer<typeof createUserSchema>;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const createAccountResult = await createAccount(
      data.email,
      {first: data.firstName, last: data.lastName},
      data.password
    );

    if (createAccountResult?.success) {
      if (createAccountResult.user) {
        // await sendVerificationEmail(
        //   createAccountResult.user?.displayName as string,
        //   createAccountResult.user?.email as string
        // );
        router.push(
          "register/verify-email?uid=" + createAccountResult?.user.uid
        );
      }
      setShowLoginModal(false);
      setIsLoading(false);
      return;
    }
    if (createAccountResult?.error) {
      if (createAccountResult?.error === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "An account with this email already exists.",
        });
        setIsLoading(false);
        return;
      }
      if (createAccountResult?.error === "auth/invalid-email") {
        setError("email", {
          type: "manual",
          message: "Please enter a valid email.",
        });
        setIsLoading(false);
        return;
      } else {
        toast({
          title: "Something went wrong.",
          description: createAccountResult?.error,
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }

  function handleLoginError(error: any): void {
    toast({
      title: "Something went wrong.",
      description: `Please try again later. Error: ${error.message || error}`,
      variant: "destructive",
    });
  }

  async function googleSingIn(): Promise<void> {
    try {
      setIsGoogleLoading(true);
      const createAccountResult = await logInWithGoogle();
      if (createAccountResult.error) {
        handleLoginError(createAccountResult.error);
      }
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsGoogleLoading(false);
      setShowLoginModal(false);
    }
  }

  return (
    <div className="h-fit w-full  md:w-fit  overflow-hidden md:border md:border-border md:rounded-2xl shadow-xl z-20 blurBack bg-background poppins-regular">
      <div className="flex flex-col space-y-2 text-center bg-muted px-4 py-6 pt-8">
        <h1 className="text-2xl md:text-4xl poppins-bold text-primary">
          Create an account to continue
        </h1>
        <p className="text-sm text-muted-foreground">
          Don&apos;t worry it&apos;s free.
        </p>
      </div>

      <div className="grid gap-4 bg-card/60 px-4 py-8 sm:px-16 ">
        <div className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2 grid-cols-2">
                <div>
                  <Input
                    className="bg-card focus-visible:ring-theme-blue dark:border dark:border-border"
                    id="firstName"
                    placeholder="First name"
                    type="text"
                    autoComplete="first name"
                    autoCorrect="off"
                    disabled={isLoading || isGoogleLoading}
                    {...register("firstName")}
                  />
                  {errors?.firstName && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    className="bg-card focus-visible:ring-theme-blue dark:border dark:border-border"
                    id="lastName "
                    placeholder="Last name"
                    type="text"
                    autoComplete="last name"
                    autoCorrect="off"
                    disabled={isLoading || isGoogleLoading}
                    {...register("lastName")}
                  />
                  {errors?.lastName && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <Input
                className="bg-card focus-visible:ring-theme-blue dark:border dark:border-border"
                id="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGoogleLoading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
              <PasswordInput
                id="Password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                className="dark:border dark:border-border"
                disabled={isLoading || isGoogleLoading}
                {...register("password")}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
              <Button
                className="w-full bg-theme-blue hover:bg-theme-blue/80 text-white"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create account
              </Button>
            </div>
          </form>
          <div className="relative flex items-center">
            <span className="w-full border-t border-muted-foreground" />
            <div className="relative text-xs uppercase whitespace-nowrap px-2 text-muted-foreground">
              Or
            </div>
            <span className="w-full border-t border-muted-foreground" />
          </div>

          <Button
            onClick={googleSingIn}
            type="button"
            className="w-full bg-muted hover:bg-opacity-60  border-none "
            variant="outline"
          >
            {isGoogleLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className=" h-6 w-6 mr-2" />
            )}
            Sign up with Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => setNewUser(false)}
            className="font-semibold text-muted-foreground transition-colors hover:text-primary underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
