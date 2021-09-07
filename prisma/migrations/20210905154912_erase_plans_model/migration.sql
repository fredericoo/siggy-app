/*
  Warnings:

  - You are about to drop the column `planId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `priceId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_planId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_planId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "planId",
ADD COLUMN     "priceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Plan";
