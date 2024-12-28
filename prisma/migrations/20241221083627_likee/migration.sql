-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "like_count" DROP NOT NULL,
ALTER COLUMN "read_count" DROP NOT NULL,
ALTER COLUMN "comment_count" DROP NOT NULL;
