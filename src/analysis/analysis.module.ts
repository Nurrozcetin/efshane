import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AnalysisService } from "./analysis.service";

Module({
    providers: [AnalysisService, PrismaService],
    exports: [AnalysisService],
})
export class AnalysisModule {}