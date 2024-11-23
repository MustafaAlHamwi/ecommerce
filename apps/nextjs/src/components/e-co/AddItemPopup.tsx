import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { api } from "~/utils/api";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

interface Props {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  productId: string;
}

const AddItemPopup = ({ dialogOpen, setDialogOpen, productId }: Props) => {
  const ctx = api.useContext();

  const [quantity, setQuantity] = useState(1);
  const { data: product } = api.product.getProductById.useQuery({
    id: productId,
  });

  const { mutate: addToCart, isLoading } =
    api.product.addItemToCart.useMutation({
      onSuccess() {
        toast.success("Item added to cart");
        setDialogOpen(false);
        void ctx.product.getCartItems.invalidate();
      },
    });
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {product?.name ?? ""}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg font-medium">{product?.description ?? ""}</p>
            <p className="text-primary text-xl font-bold">
              ${product?.price ?? ""}
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              width={100}
              height={100}
              src={product?.image ?? ""}
              alt="product"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-5 ">
          <div className="flex items-center space-x-4">
            <span className="text-md font-bold">Quantity :</span>
            <div className="flex items-start">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                className="h-8 w-8 rounded-r-none bg-red-500 px-2 font-bold text-white hover:bg-red-300 hover:text-white"
              >
                -
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="h-8 w-16 border border-x-0 border-gray-300 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                className="h-8 w-8 rounded-l-none bg-green-600 px-2  text-white hover:bg-green-300 hover:text-white"
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() =>
                addToCart({
                  productId: productId,
                  quantity: quantity,
                })
              }
            >
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
