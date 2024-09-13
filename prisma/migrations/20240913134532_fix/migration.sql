/*
  Warnings:

  - Added the required column `userId` to the `Episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episodes" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
