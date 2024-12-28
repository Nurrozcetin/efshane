-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "parentCommentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
