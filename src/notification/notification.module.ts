import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { NotifyService } from "./notification.service";
import { NotificationsGateway } from "./notification.gateway";

Module({
    providers: [NotifyService, PrismaService, NotificationsGateway],
    exports: [NotifyService, NotificationsGateway],
})
export class NotifyModule {}