/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `User` table. All the data in the column will be lost.
  - Added the required column `birthdate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "date_of_birth",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL;
