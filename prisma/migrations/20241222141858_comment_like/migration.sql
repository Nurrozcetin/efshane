-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "commentId" INTEGER,
ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
