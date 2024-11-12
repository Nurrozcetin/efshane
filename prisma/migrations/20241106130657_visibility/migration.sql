-- CreateTable
CREATE TABLE "MessageVisibility" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MessageVisibility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageVisibility" ADD CONSTRAINT "MessageVisibility_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageVisibility" ADD CONSTRAINT "MessageVisibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
