-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_postId_fkey";

-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
