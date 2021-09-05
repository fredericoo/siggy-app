/*
  Warnings:

  - You are about to drop the column `planId` on the `Template` table. All the data in the column will be lost.
  - Added the required column `minPrice` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "planId",
ADD COLUMN     "minPrice" INTEGER NOT NULL;
