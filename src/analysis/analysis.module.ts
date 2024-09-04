import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AnalysisService } from "./analysis.service";
import { AnalysisController } from "./analysis.controller";

Module({
    providers: [AnalysisService, PrismaService],
    exports: [AnalysisService],
    controllers: [AnalysisController],
})
export class AnalysisModule {}