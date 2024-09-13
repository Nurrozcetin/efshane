import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ChapterService } from "./chapter.service";

Module({
    providers: [ChapterService, PrismaService],
    exports: [ChapterService],
})
export class ChapterModule {}