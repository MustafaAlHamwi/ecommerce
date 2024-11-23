"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconShoppingCart, IconStarFilled } from "@tabler/icons-react";

import { api } from "~/utils/api";
import { Button } from "../ui/Button";
import AddItemPopup from "./AddItemPopup";

interface Props {
  id: string;
  name: string | null;
  price: number | null;
  image: string | null;
  description: string | null;
}
export const Card = (props: Props) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [productId, setProductId] = useState<string>("");

  return (
    <>
      <div className="group relative h-[375px] w-[300px] rounded-lg bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="relative h-[180px] w-full overflow-hidden">
          <Image
            width={100}
            height={100}
            src={
              props.image ? props.image : "https://via.placeholder.com/300x400"
            }
            alt="main"
            className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              onClick={() => {
                setPopupOpen(true);
                setProductId(props.id);
              }}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-2 font-semibold text-gray-800 transition-transform duration-300 hover:bg-gray-100"
            >
              <IconShoppingCart size={20} />
              {"Add to Cart"}
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p>{props.name}</p>
          <p className="line-clamp-2 text-sm text-gray-600">
            {props?.description ? props.description : "No Description"}
          </p>

          <div className="flex justify-between">
            <IconStarFilled className="text-yellow-400" />
            <IconStarFilled className="text-yellow-400" />
            <IconStarFilled className="text-yellow-400" />
            <IconStarFilled className="text-yellow-400" />
            <IconStarFilled className="text-yellow-400" />
          </div>

          <p className="text-center text-xl font-bold text-gray-800">
            {`${props?.price ? props.price : 0} $ `}
          </p>
        </div>
      </div>
      {popupOpen && (
        <AddItemPopup
          dialogOpen={popupOpen}
          setDialogOpen={setPopupOpen}
          productId={productId}
        />
      )}
    </>
  );
};
