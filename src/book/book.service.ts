import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { LibraryService } from "src/library/library.service";

@Injectable()
export class BookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly libraryService: LibraryService,
    ) {}
    async createBook(
        bookDto: CreateBookDto,
        userId: number,
    ) {
        const { title, summary, bookCover, publish} = bookDto;

        const book = await this.prisma.book.create({
            data: {
                title,
                summary,
                bookCover,
                userId,
                publish,
                publish_date: new Date(),
            },
        });
        await this.libraryService.addBookToLibrary(book.id.toString(), userId, false);
        return book;
    }

    async getAllBookByAuthor(authorId: string) {
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

    async getAllBook() {
        const currentYear = new Date().getFullYear();
        const books = await this.prisma.book.findMany({
            where: {
                publish_date: {
                    gte: new Date(`${currentYear}-01-01`), 
                    lt: new Date(`${currentYear + 1}-01-01`), 
                },
            },
            orderBy: { publish_date: 'desc' },
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                }
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`Bu yıl yayınlanan kitap bulunamadı`);
        }
        return books;
    }
    
    async getTrendsBook() {
        const books = await this.prisma.book.findMany({
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                },
                analysis: {
                    select: {
                        read_count: true,
                    }
                }
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`Trend kitap bulunamadı`);
        }
    
        books.sort((a, b) => {
            const aReadCount = a.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0);
            const bReadCount = b.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0);
            return bReadCount - aReadCount;
        });
    
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
