import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { MessageService } from "./message.service";
import { EncryptionService } from "./encryption.service";
import { MessagesGateway } from "./message.gateway";

Module({
    providers: [MessageService, PrismaService, EncryptionService, MessagesGateway],
    exports: [MessageService, MessagesGateway],
})
export class MessageModule {}