import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { UpdateProgressDto } from "./dto/update-progress.dto";

@Injectable()
export class ProgressService{
    constructor(
        private readonly prisma: PrismaService
    ){}
    async updateProgress(
        updateProgressDto: UpdateProgressDto
    ){
        const {userId, bookId, progress} =  updateProgressDto;
        return this.prisma.readingProgress.upsert({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
            update: {
                progress,
            },
            create:{
                userId,
                bookId,
                progress,
            },
        });
    }

    async getProgress(userId: number, bookId: number) {
        return this.prisma.readingProgress.findUnique({
            where:{
                userId_bookId: {
                    userId, 
                    bookId
                },
            },
        });
    }
}


