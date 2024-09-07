import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { MessageService } from "./message.service";
import { EncryptionService } from "./encryption.service";

Module({
    providers: [MessageService, PrismaService, EncryptionService],
    exports: [MessageService],
})
export class MessageModule {}