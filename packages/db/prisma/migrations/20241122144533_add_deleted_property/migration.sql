/*
  Warnings:

  - Made the column `createdBy` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
