import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-anons.dto";
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
    export class AnnouncementService {
        constructor(
            private readonly prisma: PrismaService
    ){}

    async createAnnouncement(
        createAnnouncementDto: CreateAnnouncementDto,
        authorId: number,
    ) {
        const { title, content} = createAnnouncementDto;
        const annons = await this.prisma.announcement.create({
        data: {
            title,
            content,
            authorId,
            date: new Date(),
        },
        });
        return annons;
    }

    async getAllNAnnonsByAuthorId(authorId){
        const annons = await this.prisma.announcement.findMany({
            where:{
                authorId: parseInt(authorId, 10)
            },
        });

        if (!annons || (annons).length === 0) {
            throw new NotFoundException(`No annons found for bookId ${authorId}`);
        }
        return annons;
    }

    async deleteAllAnnonsByAuthorId(authorId: string, annonsId: string){
        const annons = await this.prisma.announcement.deleteMany({
            where: {
                id: parseInt(annonsId, 10),
                authorId: parseInt(authorId, 10),
            },
        });
        return annons;
    }

    async updateAllAnnonsByAuthorId(authorId: string, annonsId: string, updateData: any){
        const annons = await this.prisma.announcement.updateMany({
            where: {
                id: parseInt(annonsId, 10),
                authorId: parseInt(authorId, 10),
            },
            data: updateData,
        });
        return annons;
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async softDeleteExpiredAnnouncements() {
        const result = await this.prisma.announcement.updateMany({
            where: {
                date: {
                    lt: new Date(Date.now() - 24 * 60 * 60 * 1000), 
                },
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        console.log(`Update result: ${result.count} records updated.`);
        return result;
    }
}
