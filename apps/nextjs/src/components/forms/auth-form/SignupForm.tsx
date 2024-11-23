"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { registerUserValidation } from "@acme/api/validations";

import { cn } from "~/utils/ui";
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
import { Progress } from "~/components/ui/Progress";
import { useAuth, usePasswordStrength } from "~/hooks";

type Inputs = z.infer<typeof registerUserValidation>;
interface Props {
  createdBy?: string;
  userFirstName?: string;
  userLastName?: string;
}

export function SignUpForm({ createdBy, userFirstName, userLastName }: Props) {
  const { isLoading, signup } = useAuth();
  const [isPending, startTransition] = useTransition();
  const form = useForm<Inputs>({
    resolver: zodResolver(registerUserValidation),
    defaultValues: {
      email: "",
      firstName: userFirstName ?? undefined,
      lastName: userLastName ?? undefined,
      password: "",
      confirmPassword: "",
      createdBy: createdBy ?? undefined,
    },
  });
  const { passwordScore, setPassword } = usePasswordStrength();
  const router = useRouter();

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      await signup(
        { ...data },
        { userFirstName: data.firstName, userLastName: data.lastName },
      );
      router.push("/home");
    });
  }

  return (
    <div className="max-w-sm p-0 lg:pt-12">
      <div>
        <div>
          <h1 className="text-[25px] font-bold">Nice To Meet You 👋</h1>
          Today is an excellent day to get started. Sign up to start shopping
        </div>
      </div>
      <Form {...form}>
        <form
          className="grid max-w-sm  gap-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Email</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#F7FBFF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required"> First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[#F7FBFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*Last  Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[#F7FBFF]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    className="bg-[#F7FBFF]"
                    {...field}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!passwordScore && (
            <Progress
              value={passwordScore}
              className={cn(" ", {
                "bg-red-300": passwordScore <= 25,
                "bg-orange-300": passwordScore > 25 && passwordScore <= 50,
                "bg-blue-300": passwordScore > 50 && passwordScore < 100,
                "bg-green-300": passwordScore === 100,
              })}
            />
          )}

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Conform Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} className="bg-[#F7FBFF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            className="mt-1"
            onClick={form.handleSubmit(onSubmit)}
            type="button"
          >
            {isLoading && (
              <IconLoader
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Sign up
          </Button>
        </form>
      </Form>
      <div className=" py-3">
        <div className="text-muted-foreground flex items-center justify-center text-sm">
          Already have an account?
          <Link
            aria-label="Sign in"
            href="/signin"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
