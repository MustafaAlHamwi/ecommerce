import type { Session } from "@acme/auth";

import { IconUser } from "~/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export const SessionUserAvatar = ({ session }: { session: Session }) => (
  <Avatar>
    <AvatarImage src={session?.user?.image!} alt="user-image" />
    <AvatarFallback>
      <IconUser />
    </AvatarFallback>
  </Avatar>
);
