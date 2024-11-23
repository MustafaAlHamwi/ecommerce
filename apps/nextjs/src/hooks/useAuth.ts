import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signIn as nextAuthSignin,
  signOut as nextAuthSignout,
} from "next-auth/react";
import { toast } from "sonner";
import type { z } from "zod";

import type {
  loginUserValidation,
  registerUserValidation,
} from "@acme/api/validations";
import type { OAuthProviders } from "@acme/auth";

import { api } from "~/utils/api";
import { catchError, nextAuthErrors } from "~/utils/error";

type RegisterInputs = z.infer<typeof registerUserValidation>;
type LoginInputs = z.infer<typeof loginUserValidation>;

export const useAuth = () => {
  const router = useRouter();
  const ctx = api.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: signupUserMutation } =
    api.user.registerUser.useMutation();

  async function signin(loginInputs: LoginInputs) {
    try {
      setIsLoading(true);

      const result = await nextAuthSignin("credentials", {
        email: loginInputs.email,
        password: loginInputs.password,
        // callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          nextAuthErrors[result.error as keyof typeof nextAuthErrors] ??
          nextAuthErrors.default;
        setIsLoading(false);
        throw new Error(errorMessage);
      }

      setIsLoading(false);

      // router.refresh();
      router.push(`${window.location.origin}/`);
      toast.success("Successfully Signed in");
      // router.replace("/");

      return result;
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }
  async function oAuthSignin(provider: OAuthProviders) {
    try {
      setIsLoading(true);

      const result = await nextAuthSignin(provider, {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        const errorMessage =
          nextAuthErrors[result.error as keyof typeof nextAuthErrors] ??
          nextAuthErrors.default;
        setIsLoading(false);
        throw new Error(errorMessage);
      }

      setIsLoading(false);

      // router.replace("/");

      return result;
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  // async function signup(email: string, name: string, password: string) {
  async function signup(
    registerInputs: RegisterInputs,
    {
      createdBy,
      userFirstName,
      userLastName,
    }: {
      createdBy?: string;
      userFirstName: string;
      userLastName: string;
    },
  ) {
    try {
      setIsLoading(true);
      const createdUser = await signupUserMutation({
        ...registerInputs,
        firstName: userFirstName,
        lastName: userLastName,
        createdBy,
      });

      if (createdUser) {
        await signin({
          email: registerInputs.email,
          password: registerInputs.password,
        });
        setIsLoading(false);

        toast.success("Successfully Signed up");
        // return ctx.invalidate();
        return createdUser;
      }
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  async function signout() {
    try {
      setIsLoading(true);
      await nextAuthSignout({ callbackUrl: "/signin", redirect: true });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      catchError(err);
    }
  }

  return {
    isLoading,
    signup,
    signin,
    signout,
    oAuthSignin,
  };
};
