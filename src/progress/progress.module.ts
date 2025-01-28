import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ProgressService } from "./progress.service";
Module({
    providers: [ProgressService, PrismaService],
    exports: [ProgressService],
})
export class ProgressModule {}