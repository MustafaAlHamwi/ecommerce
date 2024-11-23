/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { permissions, PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export type QueryEvent = {
  timestamp: Date;
  query: string; // Query sent to the database
  params: string; // Query parameters
  duration: number; // Time elapsed (in milliseconds) between client issuing query and database responding - not only time taken to run query
  target: string;
};

export type permissionsType = permissions;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log:
    //   process.env.NODE_ENV === "development"
    //     ? ["query", "info", "error", "warn"]
    //     : ["error"],
    log:
      process.env.NODE_ENV === "development"
        ? [
            {
              emit: "event",
              level: "query",
            },
            {
              emit: "stdout",
              level: "error",
            },
            {
              emit: "stdout",
              level: "warn",
            },
            {
              emit: "stdout",
              level: "info",
            },
          ]
        : ["error"],
    // [
    //   {
    //     emit: "event",
    //     level: "query",
    //   },
    // ],
  });

// if (process.env.NODE_ENV === "development") {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //@ts-ignore
//   prisma.$on("query", (e: QueryEvent) => {
//     if (e.query.includes("Parent")) {
//       // if (e.query.includes('SELECT "public"."Parent"."id",')) {
//       // if (e.query.includes("INSERT")) {
//       console.log("=====================================");
//       console.log("Query: " + e.query);
//       console.log("Params: " + e.params);
//       console.log("Duration: " + `${e.duration} ms`);
//       console.log("=====================================");
//     }
//   });
// }

//handling soft deleted records (at top-level & nested) (https://github.com/olivierwilkinson/prisma-soft-delete-middleware)

prisma.$use(
  createSoftDeleteMiddleware({
    models: {
      Account: true,
      Session: true,
      User: true,
      VerificationToken: true,
      PasswordReset: true,
      Ecommerce: true,
      PublicEmailProvider: true,
      EmailVerify: true,
    },
    defaultConfig: {
      field: "deleted",
      createValue: Boolean,
      allowToOneUpdates: true,
      allowCompoundUniqueIndexWhere: true,
    },
  }),
);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
