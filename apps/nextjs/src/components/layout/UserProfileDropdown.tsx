"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const UserProfileDropdown = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="hover:cursor-pointer ">{children}</div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] rounded-md border border-gray-200 bg-white p-2 shadow-lg"
          sideOffset={5}
        >
          <DropdownMenu.Item className="cursor-pointer px-4 py-2 hover:bg-gray-100">
            <Link href="/signout">Sing out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { UserProfileDropdown };
