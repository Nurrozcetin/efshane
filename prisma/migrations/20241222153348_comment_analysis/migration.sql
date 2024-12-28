-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "commentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
