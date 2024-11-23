"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { productValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { DebouncedInput } from "~/components/DebouncedInput";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";

interface Props {
  productId?: string;
  productDetails?: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
  };
}
const ProductForm = ({ productId, productDetails }: Props) => {
  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      id: productId ?? undefined,
      name: productDetails?.name ?? undefined,
      description: productDetails?.description ?? undefined,
      price: productDetails?.price ?? undefined,
      image: productDetails?.image ?? undefined,
    },
    shouldUnregister: false,
  });
  const handleOnChange = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  >(
    field: ControllerRenderProps<TFieldValues, TName>,
    value: FieldPathValue<TFieldValues, TName>,
  ) => {
    field.onChange(value);
  };
  const ctx = api.useContext();

  const { mutate: setProduct, isLoading } = api.product.setProduct.useMutation({
    onSuccess: (data, formInputs) => {
      // only when creating
      if (!formInputs.id) {
        toast.success("Prduct added successfully");
        if (data) {
          form.setValue("id", data?.upsertedProuduct?.id);
        }
      } else {
        toast.success("Product Updated successfully");
      }

      void ctx.product.getAllProducts.invalidate();
    },
  });
  function onSubmit(data: z.infer<typeof productValidation>) {
    setProduct({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
    });
    router.push("/home");
  }
  if (isLoading && !form.getValues("id")) {
    return <div>Loading...</div>;
  }

  // Watch the image field value to update preview
  const imageUrl =
    form.watch("image") ?? productDetails?.image ?? "/mainImg.png";
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Product Management
        </h1>
        <p className="text-md text-gray-600">
          Create or update your product details with images and pricing
        </p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="product-form"
                className="grid grid-cols-1 gap-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-gray-700">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <DebouncedInput
                          {...field}
                          inputType="input"
                          type="text"
                          value={field.value?.toString()}
                          debounce={500}
                          onChange={(value) =>
                            handleOnChange(field, value?.toString() ?? "")
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-gray-700">
                        Product Description
                      </FormLabel>
                      <FormControl>
                        <DebouncedInput
                          {...field}
                          inputType="input"
                          type="text"
                          value={field.value?.toString()}
                          debounce={500}
                          onChange={(value) =>
                            handleOnChange(field, value?.toString() ?? "")
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-gray-700">
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <DebouncedInput
                          {...field}
                          inputType="input"
                          type="text"
                          value={field.value?.toString()}
                          debounce={500}
                          onChange={(value) =>
                            handleOnChange(field, value?.toString() ?? "")
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-gray-700">
                        Product Price
                      </FormLabel>
                      <FormControl>
                        <DebouncedInput
                          {...field}
                          inputType="input"
                          type="number"
                          value={field.value?.toString()}
                          debounce={500}
                          onChange={(value) =>
                            handleOnChange(field, Number(value) ?? 0)
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="flex-start flex gap-2">
              <Button
                onClick={() => router.push("/home")}
                className="mt-4 w-[100px] bg-gray-600 py-3 text-white hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void form.handleSubmit(onSubmit)();
                }}
                className="mt-4 w-fit bg-orange-600 text-white hover:bg-orange-700 "
              >
                Save Product
              </Button>
            </div>
          </div>

          {/* Image Preview Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-md">
              <img
                src={imageUrl}
                alt="product preview"
                className="h-[400px] w-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">Product Preview Image</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductForm;
