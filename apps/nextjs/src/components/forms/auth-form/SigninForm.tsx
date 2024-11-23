"use client";

import { useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { loginUserValidation } from "@acme/api/validations";

import { PasswordInput } from "~/components/PasswordInput";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { useAuth } from "~/hooks";

type Inputs = z.infer<typeof loginUserValidation>;

export function SignInForm() {
  const { isLoading, signin } = useAuth();
  const [isPending, startTransition] = useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(loginUserValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: Inputs) {
    // if (!isLoaded) return;
    startTransition(async () => {
      const createdUser = await signin({ ...data });
    });
  }

  return (
    <div className="max-w-sm p-0 lg:pt-12">
      <div className="grid grid-cols-1 gap-1  ">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center text-[30px] font-bold">
            Welome Back
          </div>
          <span>
            Today is a new day. It's your day. You shape it. Sign in to start
            shopping.
          </span>
        </div>
        <Form {...form}>
          <form
            className="grid gap-3"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Example@email.com"
                      className="bg-[#F7FBFF]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="At least 4 characters"
                      className="bg-[#F7FBFF]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading && (
                <IconLoader
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Sing in
              <span className="sr-only">Sign In</span>
            </Button>
            <div className="grid grid-cols-1 gap-3 py-5">
              <div className="flex items-center  ">
                <div className="h-[1px] w-1/2 bg-gray-300   "></div>
                <span className="px-2">or</span>
                <div className="h-[1px] w-1/2 bg-gray-300  "></div>
              </div>
            </div>
          </form>
        </Form>
        <div className=" flex items-start justify-center">
          <span className="mr-1 hidden sm:inline-block">
            Don't have an account?
          </span>
          <Link
            aria-label="Sign up"
            href="/signup"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            <span className="text-blue-800">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
