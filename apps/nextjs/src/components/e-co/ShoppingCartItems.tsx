import React from "react";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { set } from "date-fns";

import { api } from "~/utils/api";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { ScrollArea } from "../ui/ScrollArea";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const ShoppingCartItems = ({ dialogOpen, setDialogOpen }: Props) => {
  const utils = api.useContext();
  const router = useRouter();

  const { mutate: updateQuantity } = api.product.updateItemQuantity.useMutation(
    {
      onSuccess: () => {
        utils.product.getCartItems.invalidate();
      },
    },
  );
  const { mutate: removeItem } = api.product.removeItemFromCart.useMutation({
    onSuccess: () => {
      utils.product.getCartItems.invalidate();
    },
  });

  const updateQuantityHandler = (
    itemId: string,
    method: "increase" | "decrease",
  ) => {
    updateQuantity({ itemId, method });
  };

  const { data: cartItems } = api.product.getCartItems.useQuery();

  const totalPrice = cartItems?.reduce((total, item) => {
    return total + (item?.product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogContent className="max-h-[90%] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Shopping Cart Items
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] ">
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gray-100 p-6">
                <svg
                  className="h-24 w-24 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                Your cart is empty
              </h3>
              <p className="text-center text-gray-500">
                Looks like you haven't added any items to your cart yet.
                <br /> Start shopping to fill it up!
              </p>
              <Button
                className="mt-4 bg-orange-600 hover:bg-orange-700"
                onClick={() => setDialogOpen(false)}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            cartItems?.map((item) => (
              <div
                key={item?.id}
                className="grid grid-cols-4  items-center   space-x-4 rounded-md border border-gray-500 p-3 align-middle "
              >
                <Image
                  width={100}
                  height={100}
                  src={item?.product.image ?? ""}
                  alt={item?.product.name ?? "product Img"}
                  className="h-24 w-24 rounded-full object-cover"
                />

                <p className="text-gray text-sm ">{item?.product.name}</p>
                <div className="flex items-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantityHandler(item.id, "decrease")}
                    className="h-8 w-8 rounded-r-none bg-red-500 px-2 font-bold text-white hover:bg-red-300 hover:text-white"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={item.quantity}
                    className="h-8 w-16 border border-x-0 border-gray-300 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantityHandler(item.id, "increase")}
                    className="h-8 w-8 rounded-l-none bg-green-600 px-2  text-white hover:bg-green-300 hover:text-white"
                  >
                    +
                  </Button>
                </div>
                <div className="flex justify-end ">
                  <Button
                    onClick={() => removeItem({ id: item.id })}
                    className="  h-5 w-5 rounded-full bg-transparent p-0 text-center text-red-500 hover:bg-red-800 hover:text-white"
                  >
                    <IconX />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        <DialogFooter>
          <div className="mt-6 flex w-full items-center justify-between ">
            <span className="text-md font-bold">
              Total Price:{" "}
              <span className="font-bold text-green-600">
                ${totalPrice?.toFixed(2)}
              </span>
            </span>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={cartItems?.length === 0}
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  router.push("/order");
                  setDialogOpen(false);
                }}
              >
                Order Now
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingCartItems;
