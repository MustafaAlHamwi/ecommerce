import React from "react";
import Link from "next/link";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";

function Footer() {
  return (
    <footer className="w-full bg-[#F0F0F0] ">
      <div className="flex flex-wrap justify-between px-8 py-12 md:px-16">
        <div className="mb-8 flex max-w-xs flex-col space-y-4 md:mb-0">
          <h2 className="text-2xl font-bold">SHOP.CO</h2>
          <p className="leading-relaxed text-gray-600">
            We have clothes that suits your style and which you are proud to
            wear. From women to men.
          </p>
          <div className="flex items-center space-x-4">
            <IconBrandTwitterFilled className="h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-blue-400" />
            <IconBrandFacebookFilled className="h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-blue-600" />
            <IconBrandInstagram className="h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-pink-500" />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-lg font-bold">COMPANY</h3>
          <Link
            href="/about"
            className="text-gray-600 transition-colors hover:text-black"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-gray-600 transition-colors hover:text-black"
          >
            Features
          </Link>
          <Link
            href="/works"
            className="text-gray-600 transition-colors hover:text-black"
          >
            Works
          </Link>
          <Link
            href="/career"
            className="text-gray-600 transition-colors hover:text-black"
          >
            Career
          </Link>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-lg font-bold">HELP</h3>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Customer Support
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Terms & Conditions
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Delivery Details
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Privacy Policy
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-lg font-bold">FAQ</h3>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Account
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Manage Deliveries
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Orders
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Payments
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="mb-2 text-lg font-bold">RESOURCES</h3>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Free eBooks
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Development Tutorial
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            How to - Blog
          </p>
          <p className="cursor-pointer text-gray-600 transition-colors hover:text-black">
            Youtube Playlist
          </p>
        </div>
      </div>
      <div className="border-t py-6 text-center">
        <p className="text-gray-600">Shop.co © 2024, All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
