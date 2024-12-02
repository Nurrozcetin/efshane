import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";

@Injectable()
export class ChapterService{
    constructor(private readonly prisma: PrismaService) {}
    async createChapter(
        bookTitle: string,
        chapterDto: CreateChapterDto,
        userId: number,
    ) {
        const {title, content, image } = chapterDto;
        const book = await this.prisma.book.findUnique({
            where: { title: bookTitle },
        });

        if (!book) {
            throw new NotFoundException('This book not exist. Please enter the correct book title.');
        }

        if(book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }

        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title,
                bookId: book.id,
            },
        });
    
        if (existingChapter) {
            throw new ConflictException('A chapter with the same title already exists for this book.');
        }

        if (!book) {
            throw new NotFoundException('This book not exist. Please enter the correct book title.');
        }

        const chapter = await this.prisma.chapter.create({
            data: {
                title,
                content,
                bookId: book.id,
                userId,
                publish: false,
                image: image || null,
                date: new Date(),
            },
        });
        return chapter;
    }

    async publishCreateChapter(
        bookTitle: string,
        chapterDto: CreateChapterDto,
        userId: number,
    ) {
        const { title, content, image } = chapterDto;
        const book = await this.prisma.book.findUnique({
            where: { title: bookTitle },
        });

        if (!book) {
            throw new NotFoundException('This book not exist. Please enter the correct book title.');
        }

        if(book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }

        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title,
                bookId: book.id,
            },
        });
    
        if (existingChapter) {
            throw new ConflictException('A chapter with the same title already exists for this book.');
        }
        const chapter = await this.prisma.chapter.create({
        data: {
            title,
            content,
            bookId: book.id,
            userId,
            image,
            publish: true,
            date: new Date(),
        },
        });
        return chapter;
    }

    async togglePublishChapter(
        decodedTitle: string,
        decodedChapterTitle: string,
        userId: number,
    ) {
        const book = await this.prisma.book.findUnique({
            where: { title: decodedTitle },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book title.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot modify chapters.');
        }
    
        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title: decodedChapterTitle,
                bookId: book.id,
            },
        });
    
        if (!existingChapter) {
            throw new NotFoundException('This chapter does not exist for the specified book.');
        }
    
        const updatedChapter = await this.prisma.chapter.update({
            where: {
                id: existingChapter.id,
            },
            data: {
                publish: !existingChapter.publish, 
            },
        });
    
        return updatedChapter;
    }    
    
    async getAllChaptersByBookTitle(authorId: number, title: string) {
        if (!authorId || typeof authorId !== 'number') {
            throw new BadRequestException('Invalid user ID provided.');
        }
    
        const book = await this.prisma.book.findUnique({
            where: { title: title },
            select: { id: true } 
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book title.');
        }

        const chapters = await this.prisma.chapter.findMany({
            where: {
                userId: authorId,
                bookId: book.id,
            },
            include: {
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        read_count: true
                    }
                }
            }
        });
    
        if (!chapters || chapters.length === 0) {
            throw new NotFoundException(`No chapters found for the book titled "${title}".`);
        }

        console.log(JSON.stringify(chapters, null, 2));
        return chapters;
    }
    
    async deleteChapter(
        decodedTitle: string,
        decodedChapterTitle: string,
        userId: number
    ) {
        const book = await this.prisma.book.findUnique({
            where: { title: decodedTitle },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not authorized to delete chapters from this book.');
        }
    
        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title: decodedChapterTitle,
                bookId: book.id,
            },
        });
    
        if (!existingChapter) {
            throw new NotFoundException('This chapter does not exist.');
        }
    
        await this.prisma.chapter.delete({
            where: { id: existingChapter.id },
        });
    
        return { message: 'Chapter deleted successfully.' };
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
