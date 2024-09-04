import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AnnouncementService } from "./anons.service";

Module({
    providers: [AnnouncementService, PrismaService],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}