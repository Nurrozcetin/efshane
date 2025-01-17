/*
  Warnings:

  - Added the required column `name` to the `ListeningList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ReadingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListeningList" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReadingList" ADD COLUMN     "name" TEXT NOT NULL;
