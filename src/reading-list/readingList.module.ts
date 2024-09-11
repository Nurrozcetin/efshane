import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ReadingListService } from "./readingList.service";

Module({
    providers: [ReadingListService, PrismaService],
    exports: [ReadingListService],
})
export class ReadingListModule {}