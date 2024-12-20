/*
  Warnings:

  - Added the required column `image` to the `Episodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedTitle` to the `Episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episodes" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "normalizedTitle" TEXT NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT;
