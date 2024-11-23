import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { SignUpForm } from "~/components/forms/auth-form/SignupForm";

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign Up",
  description: "Sign up for an account",
};

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="absolute grid h-screen w-full  grid-cols-1 p-5 sm:grid-cols-2 md:p-0">
      <div className="flex w-full items-center justify-center ">
        <div className="md:p-3 ">
          <div className="grid max-w-sm gap-2">
            <SignUpForm />
          </div>
        </div>
      </div>

      <div
        className="flex h-full w-full items-center justify-center sm:flex sm:items-center sm:justify-center"
        style={{
          background:
            "linear-gradient(210.65deg, #FEF4E9 0%, #F5F0FF 50.37%, #E4E9FF 100%)",
        }}
      >
        <img src="/logo.png" alt="img " className="p-10" />
      </div>
    </div>
  );
}
