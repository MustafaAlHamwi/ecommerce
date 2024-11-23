"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconMenu2,
  IconShoppingCart,
  IconUser,
  IconX,
} from "@tabler/icons-react";

import type { Session } from "@acme/auth";

import { SessionUserAvatar } from "../layout/SessionUserAvatar";
import { UserProfileDropdown } from "../layout/UserProfileDropdown";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import ShoppingCartItems from "./ShoppingCartItems";

interface Props {
  session: Session;
}
const NavBar = ({ session }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      router.push("/shop");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="w-full items-center bg-[#e7e4e4] px-16 text-black">
        <div className="grid w-full grid-cols-12 items-center px-5 py-7 align-middle">
          <div className="col-span-6 text-2xl font-bold md:col-span-2">
            SHOP.CO
          </div>

          <div className="col-span-6 flex justify-end md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </Button>
          </div>

          {/* Navigation Links */}
          <div
            className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-20 z-50 col-span-12 flex-col justify-around bg-[#e7e4e4] py-4 font-bold md:relative md:top-0 md:col-span-4 md:flex md:flex-row md:py-0`}
          >
            <Link
              href="/home"
              className={`rounded-md p-2 text-center font-bold transition-all hover:bg-gray-100 ${
                pathname === "/home"
                  ? "border-b-2 border-black bg-gray-100"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`rounded-md p-2 text-center font-bold transition-all hover:bg-gray-100 ${
                pathname === "/shop"
                  ? "border-b-2 border-black bg-gray-100"
                  : ""
              }`}
            >
              Shop
            </Link>
            <Link
              href="/product/add-product"
              className={`rounded-md p-2 text-center font-bold transition-all hover:bg-gray-100 ${
                pathname === "/product/add-product"
                  ? "border-b-2 border-black bg-gray-100"
                  : ""
              }`}
            >
              Add Product
            </Link>
          </div>
          {/* Desktop Search */}
          <div className="col-span-5 hidden justify-center md:flex">
            <form onSubmit={handleSubmit} className="w-[90%]">
              <Input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full"
              />
            </form>
          </div>

          {/* Cart and User Icons */}
          <div className="col-span-1 hidden gap-2 md:flex">
            <Button
              className="bg-transparent text-black hover:bg-white/50"
              onClick={() => setPopoverOpen(true)}
            >
              <IconShoppingCart />
            </Button>
            <UserProfileDropdown>
              <SessionUserAvatar session={session} />
            </UserProfileDropdown>
            {/* <Button className="bg-transparent text-black hover:bg-white/50">
              <IconUser />
            </Button> */}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-5 pb-4 md:hidden">
          <form onSubmit={handleSubmit}>
            <Input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full"
            />
          </form>
        </div>

        {/* Cart and User Icons for Mobile */}
        <div className="flex justify-center gap-2 pb-4 md:hidden">
          <Button
            className="bg-transparent text-black hover:bg-white/50"
            onClick={() => setPopoverOpen(true)}
          >
            <IconShoppingCart />
          </Button>
          <Button className="bg-transparent text-black hover:bg-white/50">
            <IconUser />
          </Button>
        </div>
      </div>
      <ShoppingCartItems
        dialogOpen={popoverOpen}
        setDialogOpen={setPopoverOpen}
      />
    </>
  );
};

export default NavBar;
