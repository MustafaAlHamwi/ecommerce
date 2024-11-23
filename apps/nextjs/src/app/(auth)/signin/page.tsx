import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { SignInForm } from "~/components/forms/auth-form/SigninForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="absolute grid min-h-screen w-full grid-cols-1 gap-2 p-5 sm:grid-cols-2 lg:p-0">
      <div className="grid grid-cols-1  justify-items-stretch py-10">
        <div className="flex justify-center sm:pt-9">
          <SignInForm />
        </div>
      </div>

      <div
        className="flex h-full w-full items-start justify-start sm:flex sm:items-center sm:justify-center"
        style={{
          background:
            "linear-gradient(210.65deg, #FEF4E9 0%, #F5F0FF 50.37%, #E4E9FF 100%)",
        }}
      >
        <img
          src="/logo.png
        "
          alt="img "
          className="p-10"
        />
      </div>
    </div>
  );
}
