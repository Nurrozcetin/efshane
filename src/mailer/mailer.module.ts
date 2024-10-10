import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { MailerService } from "./mailer.service";

Module({
    providers: [MailerService, PrismaService],
    exports: [MailerService],
})
export class MailerModule {}