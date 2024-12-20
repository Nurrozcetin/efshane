-- AlterTable
ALTER TABLE "Episodes" ADD COLUMN     "content" TEXT,
ALTER COLUMN "audioFile" DROP NOT NULL;
