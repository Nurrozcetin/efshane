import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AudioBookService } from "./audioBook.service";
import { NotificationsGateway } from "src/notification/notification.gateway";

Module({
    providers: [AudioBookService, PrismaService, NotificationsGateway],
    exports: [AudioBookService, NotificationsGateway],
})
export class AudioBookModule {}