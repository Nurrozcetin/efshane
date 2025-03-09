/*
  Warnings:

  - Added the required column `normalizedTitle` to the `ReadingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingList" ADD COLUMN     "normalizedTitle" TEXT NOT NULL;
