import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import "~/styles/globals.css";

import { redirect } from "next/navigation";

import { serverSideCallerProtected } from "@acme/api";
import type { Session } from "@acme/auth";
import { auth } from "@acme/auth";

import Footer from "~/components/e-co/Footer";
import NavBar from "~/components/e-co/NavBar";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SHOP.CO",
  description: "SHOP.CO",
  icons: {
    icon: "/favicon.ico",
  },
};

const allowedPublicUrls = ["/signin", "/signup"];

export default async function Layout(props: { children: React.ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-current-path") || "";
  const session = await auth();
  console.log(session);
  if (!session) {
    if (!allowedPublicUrls.includes(pathname)) {
      redirect("/signin");
    } else {
      return <GlobalLayout session={session}>{props.children}</GlobalLayout>;
    }
  }
  const isEmailVerified = await (
    await serverSideCallerProtected()
  ).user.isUserEmailVerified({ email: session.user.email ?? "" });

  if (!isEmailVerified) {
    return (
      <GlobalLayout session={session}>
        <NavBar session={session} />

        {props.children}
        <Footer />
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout session={session}>
      <NavBar session={session} />

      {props.children}

      <Footer />
    </GlobalLayout>
  );
}

const GlobalLayout = ({
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) => {
  return (
    <html>
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
};
