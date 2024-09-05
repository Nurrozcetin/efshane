import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { SectionService } from "./section.service";

Module({
    providers: [SectionService, PrismaService],
    exports: [SectionService],
})
export class SectionModule {}