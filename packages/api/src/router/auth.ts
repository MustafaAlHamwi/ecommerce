import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

import type { Session } from "@acme/auth";
import {
  adapter,
  invalidateSessionToken,
  sessionTokenMaxAge,
} from "@acme/auth";

import { convertImagePathsToBase64 } from "../../utils";
import { serverSideCallerPublic } from "../serverSideCaller";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { loginUserValidation } from "../validations/auth";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(async ({ ctx }) => {
    const base64UserImage = await convertImagePathsToBase64([
      { image: ctx.session?.user?.image },
    ]);

    let session: Session | null = null;
    if (ctx.session) {
      session = {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          image: base64UserImage[0]?.image,
        },
      };
    }

    return session;
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.token)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Session token not found!!",
      });

    // unregister parent notification after singing out
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: { notificationToken: null },
    });

    await invalidateSessionToken(ctx.token);
  }),

  signIn: publicProcedure
    .input(loginUserValidation)
    .mutation(async ({ input }) => {
      const oauthToken = nanoid(256);
      const caller = await serverSideCallerPublic();
      const user = await caller.user.loginUser({
        email: input.email,
        password: input.password,
      });
      if (user) {
        const token = nanoid(256);
        await adapter.createSession?.({
          userId: user.id,
          expires: new Date(Date.now() + sessionTokenMaxAge * 1000),
          sessionToken: token,
        });

        const userJwt: {
          id: string;
          firstName: string;
          lastName: string;
          email: string | null;
          image: string | null;
          sessionToken: string;
        } = {
          id: user.id,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email,
          image: user.image,
          sessionToken: token,
        };

        return userJwt;
      } else {
        return null;
      }
    }),
});
