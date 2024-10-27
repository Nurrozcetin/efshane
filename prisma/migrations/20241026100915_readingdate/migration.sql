/*
  Warnings:

  - Added the required column `lastreading` to the `ReadingProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingProgress" ADD COLUMN     "lastreading" TIMESTAMP(3) NOT NULL;
