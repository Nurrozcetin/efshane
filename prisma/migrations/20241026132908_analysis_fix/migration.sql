/*
  Warnings:

  - You are about to drop the column `view_count` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `comment_count` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "view_count",
ADD COLUMN     "comment_count" INTEGER NOT NULL;
