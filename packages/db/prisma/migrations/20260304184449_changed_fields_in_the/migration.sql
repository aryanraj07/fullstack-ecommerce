/*
  Warnings:

  - You are about to drop the column `minOrderQty` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shippingInfo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyInfo` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "minOrderQty",
DROP COLUMN "shippingInfo",
DROP COLUMN "warrantyInfo",
ADD COLUMN     "minimumOrderQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "shippingInformation" TEXT,
ADD COLUMN     "warrantyInformation" TEXT;
