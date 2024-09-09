import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { NotifyService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

Module({
    providers: [NotifyService, PrismaService],
    exports: [NotifyService],
})
export class NotifyModule {}