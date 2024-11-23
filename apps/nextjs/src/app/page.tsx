import { redirect } from "next/navigation";

import { serverSideCallerProtected } from "@acme/api";
import { convertImagePathsToBase64 } from "@acme/api/utils";
import { auth } from "@acme/auth";

// import { AuthRequiredError } from "~/utils/exceptions";

// export const runtime = "edge";

export default async function HomePage() {
  // const caller = await serverSideCallerProtected();
  // const posts = await caller?.post.all();
  const session = await auth();
  if (!session) {
    // throw new AuthRequiredError({ redirect: true });
    redirect("/signin");
  }

  const isEmailVerified = await (
    await serverSideCallerProtected()
  ).user.isUserEmailVerified({ email: session.user.email ?? "" });

  if (!isEmailVerified) redirect("/home");

  redirect("/home");

  const base64UserImage = await convertImagePathsToBase64([
    { image: session.user.image },
  ]);
  session.user.image = base64UserImage[0]?.image;
}
