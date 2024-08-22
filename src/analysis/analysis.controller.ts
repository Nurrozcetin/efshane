import { Controller, Get, Param } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";

@Controller('analysis')
export class AnalysisController {
    constructor(private readonly analysisService: AnalysisService) {}

    @Get(':bookId')
    async getAllAnalysisByBookId(@Param('bookId') bookId: string): Promise<any> {
        return this.analysisService.getAllAnalysisByBookId(bookId);
    }
}