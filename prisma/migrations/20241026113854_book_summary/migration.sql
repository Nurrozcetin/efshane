/*
  Warnings:

  - Added the required column `summary` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "summary" TEXT NOT NULL;