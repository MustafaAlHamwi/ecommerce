import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { orderValidation } from "../validations/order";
import { productValidation } from "../validations/product";

export const productRouter = createTRPCRouter({
  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({});
    return products;
  }),
  getProductById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return product;
    }),

  setProduct: protectedProcedure
    .input(productValidation)
    .mutation(async ({ ctx, input }) => {
      const upsertedProuduct = await ctx.prisma.product.upsert({
        where: {
          id: input.id ?? "",
        },
        create: {
          name: input.name,
          description: input.description,
          price: input.price,
          image: input.image,
        },
        update: {
          name: input.name,
          description: input.description,
          price: input.price,
          image: input.image,
        },
      });
      return { upsertedProuduct };
    }),

  addItemToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().default(1), // Default to 1 if not provided
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const existingOrder = await ctx.prisma.order.findFirst({
        where: { userId: userId },
      });

      const order =
        existingOrder ||
        (await ctx.prisma.order.create({
          data: {
            userId: userId,
            createdBy: ctx.session.user.id,
            ecommerceId: "1",
          },
        }));

      const existingCart = await ctx.prisma.shoppingCart.findFirst({
        where: { userId: userId },
      });

      const cart =
        existingCart ||
        (await ctx.prisma.shoppingCart.create({
          data: { userId: userId, orderId: order.id },
        }));

      try {
        const existingCartItem = await ctx.prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: input.productId,
            deleted: false,
          },
        });

        if (existingCartItem) {
          await ctx.prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + input.quantity },
          });
        } else {
          await ctx.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: input.productId,
              quantity: input.quantity,
            },
          });
        }

        return { message: "Item added to cart successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error adding item to cart",
        });
      }
    }),

  getCartItems: protectedProcedure.query(async ({ ctx }) => {
    const shoppinCartItems = await ctx.prisma.cartItem.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        deleted: false,
      },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
    return shoppinCartItems;
  }),
  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        method: z.enum(["increase", "decrease"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.prisma.cartItem.findUnique({
        where: {
          id: input.itemId,
        },
        select: {
          quantity: true,
        },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      const newQuantity =
        input.method === "increase"
          ? cartItem.quantity + 1
          : Math.max(0, cartItem.quantity - 1);

      return await ctx.prisma.cartItem.update({
        where: {
          id: input.itemId,
        },
        data: {
          quantity: newQuantity,
        },
      });
    }),
  removeItemFromCart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.cartItem.update({
        where: {
          id: input.id,
        },
        data: { deleted: true },
      });
    }),
  clearShoppingCart: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: ctx.session.user.id,
        },
      },
    });
  }),
  upsertOrder: protectedProcedure
    .input(orderValidation)
    .mutation(async ({ ctx, input }) => {
      const upsertedOrder = await ctx.prisma.order.upsert({
        where: { userId: ctx.session.user.id, ecommerceId: "1" },
        create: {
          createdBy: ctx.session.user.id,
          userId: ctx.session.user.id,
          userEmail: input.email,
          userName: input.firstName + " " + input.lastName,
          userNumber: input.phoneNumber,
          userAddress: input.address,
          userCity: input.city,
          paymentMethod: input.paymentMethod,
          userPostalCode: input.postalCode,
          ecommerceId: "1",
        },
        update: {
          userId: ctx.session.user.id,
          userEmail: input.email,
          userName: input.firstName + " " + input.lastName,
          userNumber: input.phoneNumber,
          userAddress: input.address,
          userCity: input.city,
          paymentMethod: input.paymentMethod,
          userPostalCode: input.postalCode,
          updatedAt: new Date(),
          updatedBy: ctx.session.user.id,
        },
      });
      return upsertedOrder;
    }),
});
