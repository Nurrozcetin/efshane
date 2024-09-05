import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSectionDto } from "./dto/create-section.dto";

@Injectable()
export class SectionService{
    constructor(private readonly prisma: PrismaService) {}
    async createSection(
        sectionDto: CreateSectionDto,
        userId: number,
    ) {
        const { title, content, bookId } = sectionDto;
        const book = await this.prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundException('This book not exist. Please enter the correct book id.');
        }

        if(book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add sections.')
        }

        const section = await this.prisma.section.create({
        data: {
            title,
            content,
            bookId,
            userId,
            date: new Date(),
        },
        });
        return section;
    }

    async getAllSectionsByBookId(authorId: string, bookId: string){
        const sections = await this.prisma.section.findMany({
            where:{
                userId: parseInt(authorId, 10),
                bookId: parseInt(bookId, 10),
            },
        });

        if (!sections || (sections).length === 0) {
            throw new NotFoundException(`No notes found for bookId ${bookId}`);
        }
        return sections;
    }


    async deleteAllSectionsByBookId(bookId: string, sectionsId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot delete sections.');
        }
    
        const sections = await this.prisma.section.deleteMany({
            where: {
                id: parseInt(sectionsId, 10),
                bookId: parseInt(bookId, 10),
            },
        });
        return sections;
    }

    async updateAllSectionsByBookId(bookId: string, sectionsId: string, updateData: any, userId: number){
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot update sections.');
        }

        const sections = await this.prisma.section.updateMany({
            where: {
                id: parseInt(sectionsId, 10),
                bookId: parseInt(bookId, 10),
            },
            data: updateData,
        });
        return sections;
    }
    
}
