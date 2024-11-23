"use client";

import { LogOutButtons } from "~/components/auth/LogoutButtons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/PageHeader";
import { Shell } from "~/components/shells/Shell";

export default function SignOutPage() {
  return (
    <Shell className="max-w-xs">
      <PageHeader className="text-center">
        <PageHeaderHeading size="sm">Sign out</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Are you shore you want to sing out
        </PageHeaderDescription>
      </PageHeader>
      <LogOutButtons />
    </Shell>
  );
}
