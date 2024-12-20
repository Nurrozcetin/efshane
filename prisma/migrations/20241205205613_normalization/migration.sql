/*
  Warnings:

  - Added the required column `normalizedTitle` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "normalizedTitle" TEXT NOT NULL;
