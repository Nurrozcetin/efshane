import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BookService } from "./book.service";
import { NotificationsGateway } from "src/notification/notification.gateway";

Module({
    providers: [BookService, PrismaService, NotificationsGateway],
    exports: [BookService, NotificationsGateway],
})
export class BookModule {}