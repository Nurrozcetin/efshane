import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSectionDto } from "./dto/create-section.dto";

@Injectable()
export class SectionService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createSection(createSectionDto: CreateSectionDto) {
        const { title, content, bookId} =  createSectionDto;
        return this.prisma.section.create({
            data: {
                title,
                content,
                bookId
            }
        });
    }

    async getAllSection() {
        return this.prisma.section.findMany();
    }

    async getAllSectionsByBookId(bookId: string) {
        const sections = await this.prisma.section.findMany({
            where: {
                bookId: parseInt(bookId, 10), 
            },
        });
    
        if (!sections || sections.length === 0) {
            throw new NotFoundException(`No sections found for bookId ${bookId}`);
        }
    
        return sections;
    }

    async deleteAllSectionsByBookId(bookId: string) {
        const sections = await this.prisma.section.deleteMany({
            where: {
                bookId: parseInt(bookId, 10), 
            },
        });
        return sections;
    }

    async deleteSectionById(sectionId: string) {
        const section = await this.prisma.section.delete({
            where: {
                id: parseInt(sectionId, 10), 
            },
        });
        return section;
    }
    
}