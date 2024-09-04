-- DropIndex
DROP INDEX "Announcement_authorId_key";

-- AlterTable
ALTER TABLE "Following" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
