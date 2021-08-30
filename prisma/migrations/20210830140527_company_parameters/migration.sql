/*
  Warnings:

  - Added the required column `isCompanyParameter` to the `TemplateParameter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateParameter" ADD COLUMN     "isCompanyParameter" BOOLEAN NOT NULL;
