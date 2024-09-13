import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";

@Injectable()
export class ChapterService{
    constructor(private readonly prisma: PrismaService) {}
    async createChapter(
        chapterDto: CreateChapterDto,
        userId: number,
    ) {
        const { title, content, bookId } = chapterDto;
        const book = await this.prisma.book.findUnique({
            where: { id: bookId },
        });

        if (!book) {
            throw new NotFoundException('This book not exist. Please enter the correct book id.');
        }

        if(book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }

        const chapter = await this.prisma.chapter.create({
        data: {
            title,
            content,
            bookId,
            userId,
            date: new Date(),
        },
        });
        return chapter;
    }

    async getAllChaptersByBookId(authorId: string, bookId: string){
        const chapters = await this.prisma.chapter.findMany({
            where:{
                userId: parseInt(authorId, 10),
                bookId: parseInt(bookId, 10),
            },
        });

        if (!chapters || (chapters).length === 0) {
            throw new NotFoundException(`No notes found for bookId ${bookId}`);
        }
        return chapters;
    }


    async deleteAllChaptersByBookId(bookId: string, chaptersId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot delete chapters.');
        }
    
        const chapters = await this.prisma.chapter.deleteMany({
            where: {
                id: parseInt(chaptersId, 10),
                bookId: parseInt(bookId, 10),
            },
        });
        return chapters;
    }

    async updateAllChaptersByBookId(bookId: string, chaptersId: string, updateData: any, userId: number){
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot update chapters.');
        }

        const chapters = await this.prisma.chapter.updateMany({
            where: {
                id: parseInt(chaptersId, 10),
                bookId: parseInt(bookId, 10),
            },
            data: updateData,
        });
        return chapters;
    }
}
