import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { differenceInMinutes } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validations/auth";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(registerUserValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists!!",
        });

      const hashedPassword = await bcrypt.hash(input.password, 10);

      // const audit = { createdBy: input.createdBy, updatedBy: input.createdBy };
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          // image: faker.image.url({ width: 480, height: 480 }),
          Accounts: {
            create: {
              password: hashedPassword,
              provider: "credentials",
              type: "credentials",
              // providerAccountId: user.id
              // ...audit,
            },
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      // const audit = { createdBy: input.createdBy, updatedBy: input.createdBy };
    }),

  isUserEmailVerified: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const userRecord = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        include: { Accounts: true },
      });

      if (userRecord) {
        const credentialsAccounts = userRecord.Accounts.filter(
          (account) => account.provider !== "credentials",
        );
        if (credentialsAccounts.length !== 0 && userRecord.email) {
          await ctx.prisma.user.update({
            where: { email: userRecord.email },
            data: { emailVerified: new Date() },
          });
          return true;
        }
        if (userRecord.emailVerified) {
          return true;
        }
        return false;
      }
      return false;
    }),
  // sendEmail: protectedProcedure
  //   .input(z.object({ to: z.string(), subject: z.string(), text: z.string() }))
  //   .mutation(async ({ input }) => {
  //     await sendMail({
  //       to: input.to,
  //       subject: input.subject,
  //       text: input.text,
  //     });
  //   }),
  loginUser: publicProcedure
    .input(loginUserValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      const userAccount = await ctx.prisma.account.findUniqueOrThrow({
        where: { userId: foundUser.id },
      });

      const correctPassword = userAccount.password
        ? await bcrypt.compare(input.password, userAccount.password) // returns true if same
        : false;

      if (!correctPassword) {
        if (userAccount.failedSignins && userAccount.failedSignins >= 10) {
          const differenceInMinutesLastTry = differenceInMinutes(
            new Date(),
            userAccount.updatedAt,
          );

          if (differenceInMinutesLastTry <= 10)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Account locked!! try again after ${10 - differenceInMinutesLastTry} minutes`,
            });

          await ctx.prisma.account.update({
            where: { id: userAccount.id },
            data: { failedSignins: 0 },
          });
        }

        await ctx.prisma.account.update({
          where: { id: userAccount.id },
          data: { failedSignins: { increment: 1 } },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wrong password!!",
        });
      }

      return foundUser;
    }),

  getUserNewSessionInfo: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      if (!user)
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      return user;
    }),

  getNotificationToken: protectedProcedure
    .input(z.object({ userEmail: z.string() }))
    .query(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.userEmail,
        },
        select: { id: true, email: true, notificationToken: true },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      return foundUser;
    }),

  upsertNotificationToken: protectedProcedure
    .input(z.object({ notificationToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email ?? "",
        },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!!",
        });

      const updatedUser = await ctx.prisma.user.update({
        where: { id: foundUser.id },
        data: { notificationToken: input.notificationToken },
      });

      return updatedUser;
    }),

  updateUser: protectedProcedure
    .input(updateUserValidation)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!foundUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User doesn't exist!!",
        });

      return ctx.prisma.user.update({
        where: { id: foundUser.id },
        data: {
          email: input.email,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    }),
});
