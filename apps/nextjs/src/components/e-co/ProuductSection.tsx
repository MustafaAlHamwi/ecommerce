/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React from "react";
import Link from "next/link";
import { IconStarFilled, IconUserCircle } from "@tabler/icons-react";
import { number } from "zod";

import { api } from "~/utils/api";
import { Card } from "./Card";

// import { api } from "@/trpc/server";

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "John Doe",
    message: "Amazing product! Exactly what I was looking for.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Smith",
    message: "Great quality and fast shipping.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mike Johnson",
    message: "Best purchase I've made this year!",
    rating: 5,
  },
];

const ProductSection = () => {
  const { data: products } = api.product.getAllProducts.useQuery();

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products
            ?.slice(0, 8)
            .map((product) => (
              <Card
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
              />
            ))}
        </div>
        <Link
          href={"/shop"}
          className="mt-8 block w-fit rounded-lg bg-black p-2 text-center text-xl font-bold text-white"
        >
          Show More
        </Link>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Happy Customers
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <IconUserCircle />

                <div>
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  <div className="flex gap-1">
                    {Array(review.rating)
                      .fill(null)
                      .map((_, i) => (
                        <IconStarFilled
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                        />
                      ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{review.message}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </>
  );
};
export default ProductSection;
