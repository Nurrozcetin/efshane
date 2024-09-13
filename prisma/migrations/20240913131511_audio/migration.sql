/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Episodes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Episodes" DROP CONSTRAINT "Episodes_sectionId_fkey";

-- AlterTable
ALTER TABLE "Episodes" DROP COLUMN "sectionId";
