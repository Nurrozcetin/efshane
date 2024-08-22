import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AnalysisService {
    constructor(
        private readonly prisma: PrismaService,
    ){}

    async getAllAnalysisByBookId(bookId: string){
        const analysis = await this.prisma.analysis.findMany({
            where:{
                bookId: parseInt(bookId, 10),
            },
        });

        if (!analysis || (analysis).length === 0) {
            throw new NotFoundException(`No analysis found for bookId ${bookId}`);
        }
        return analysis;
    }

}