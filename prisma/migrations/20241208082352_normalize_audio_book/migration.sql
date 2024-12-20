/*
  Warnings:

  - Added the required column `normalizeTitle` to the `AudioBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioBook" ADD COLUMN     "normalizeTitle" TEXT NOT NULL;
