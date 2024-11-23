"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCreditCard,
  IconShoppingBag,
  IconTruck,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { orderValidation } from "@acme/api/validations";

import { api } from "~/utils/api";
import { DebouncedInput } from "~/components/DebouncedInput";
import { IconUser } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";

const OrderForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof orderValidation>>({
    resolver: zodResolver(orderValidation),
    defaultValues: {
      id: undefined,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      paymentMethod: "",
      postalCode: "",
    },
  });

  const { mutate: upsertOrderHandler, isLoading } =
    api.product.upsertOrder.useMutation({
      onSuccess: () => {
        toast.success("Order placed successfully!");
        router.push("/home");
      },
      onError: () => {
        toast.error("Failed to place order. Please try again.");
      },
    });

  function onSubmit(data: z.infer<typeof orderValidation>) {
    upsertOrderHandler(data);
  }
  const utils = api.useContext();

  const { mutate: clearSoppingCartHandler } =
    api.product.clearShoppingCart.useMutation({
      onSuccess: () => {
        void utils.product.getCartItems.invalidate();
      },
      onError: () => {
        toast.error("Failed to clear shopping cart. Please try again.");
      },
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-center space-x-2">
          <IconShoppingBag className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 flex items-center space-x-2">
                  <IconUser />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="John"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="Doe"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="email"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="john.doe@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="tel"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="+1 (555) 000-0000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Shipping Information Section */}
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 flex items-center space-x-2">
                  <IconTruck className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Shipping Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="123 Main Street"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="New York"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="NY"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="10001"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <DebouncedInput
                            {...field}
                            inputType="input"
                            type="text"
                            value={field.value?.toString()}
                            debounce={500}
                            onChange={(value) => field.onChange(value)}
                            className="input-styled"
                            placeholder="United States"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 flex items-center space-x-2">
                  <IconCreditCard className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Payment Method
                  </h2>
                </div>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-styled">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit_card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank_transfer">
                            Bank Transfer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Billing Postal Code</FormLabel>
                      <FormControl>
                        <DebouncedInput
                          {...field}
                          inputType="input"
                          type="text"
                          value={field.value?.toString()}
                          debounce={500}
                          onChange={(value) => field.onChange(value)}
                          className="input-styled"
                          placeholder="Enter billing postal code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 text-white hover:bg-orange-700"
                  disabled={isLoading}
                  onClick={() => {
                    clearSoppingCartHandler();
                  }}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
