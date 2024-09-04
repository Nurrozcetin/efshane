-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_readingListId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "readingListId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_readingListId_fkey" FOREIGN KEY ("readingListId") REFERENCES "ReadingList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
