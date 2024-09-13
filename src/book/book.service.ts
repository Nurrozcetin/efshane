import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";

@Injectable()
export class BookService{
    constructor(private readonly prisma: PrismaService) {}
    async createBook(
        bookDto: CreateBookDto,
        userId: number,
    ) {
        const { title, bookCover, publish} = bookDto;

        const book = await this.prisma.book.create({
            data: {
                title,
                bookCover,
                userId,
                publish,
                publish_date: new Date(),
            },
        });
        return book;
    }

    async getAllBook(authorId: string) {
        const books = await this.prisma.book.findMany({
            where: {
                userId: parseInt(authorId, 10), 
            },
            include: {
                chapter: true,
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`No books found for authorId ${authorId}`);
        }
        return books;
    }

    async deleteBook(bookId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot delete chapters.');
        }
    
        const books = await this.prisma.book.deleteMany({
            where: {
                id: parseInt(bookId, 10),
            },
        });
        return books;
    }

    async updateBook(bookId: string, updateData: any, userId: number){
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot update book.');
        }

        const books = await this.prisma.book.updateMany({
            where: {
                id: parseInt(bookId, 10),
            },
            data: updateData,
        });
        return books;
    }
    
}
