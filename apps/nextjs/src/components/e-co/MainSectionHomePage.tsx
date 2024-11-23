import React from "react";
import Image from "next/image";

import { Button } from "../ui/Button";

function MainSectionHomePage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-between bg-[#f3f0f1] px-20 py-5">
        <div className="flex max-w-xl flex-col gap-8">
          <h1 className="text-6xl font-bold tracking-tight">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="text-lg text-gray-600">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Button className="w-fit rounded-lg bg-black px-8 py-6 text-lg text-white shadow-white">
            Shop Now
          </Button>
          <div className="mt-4 flex gap-x-12">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">200+</p>
              <p className="text-gray-600">International Brands</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">2000+</p>
              <p className="text-gray-600">High-Quality Products</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-bold">30,000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/mainImg.png"
            alt="mainImg"
            width={1000}
            height={1000}
            priority
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-between gap-4 bg-black p-4 md:p-10">
        <span className="text-2xl text-white md:text-4xl lg:text-6xl">
          VERSACE
        </span>
        <span className="text-2xl text-white md:text-4xl lg:text-6xl">
          ZARA
        </span>
        <span className="text-2xl text-white md:text-4xl lg:text-6xl">
          GUCCI
        </span>
        <span className="text-2xl text-white md:text-4xl lg:text-6xl">
          PRADA
        </span>
        <span className="text-2xl text-white md:text-4xl lg:text-6xl">
          CALVIN KLEIN
        </span>
      </div>
    </>
  );
}

export default MainSectionHomePage;
