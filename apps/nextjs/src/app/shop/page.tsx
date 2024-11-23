"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { api } from "~/utils/api";
import { Card } from "~/components/e-co/Card";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const Shop = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";
  const { data: products, isLoading } = api.product.getAllProducts.useQuery();

  if (isLoading) {
    return (
      <div className="h-screen items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredProducts = products?.filter((product) =>
    (product.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Welcome to Our Shop
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover our exclusive collection of high-quality products and
            trendy clothes. From casual wear to elegant outfits, find everything
            you need to express your unique style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts?.map((product) => (
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
      </section>
    </>
  );
};

export default Shop;
