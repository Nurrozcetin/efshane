import { User } from '@prisma/client';
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class BookCaseService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookToBookCase(bookId: string, userId: number, isAudioBook: boolean) {
        let book;

        if (isAudioBook) {
            book = await this.prisma.audioBook.findUnique({
                where: { id: parseInt(bookId, 10) },
            });
        } else {
            book = await this.prisma.book.findUnique({
                where: { id: parseInt(bookId, 10) },
            });
        }

        if (!book) {
            throw new NotFoundException('This book does not exist.');
        }

        let bookCase = await this.prisma.bookCase.findFirst({
            where: { userId: userId },
            include: { books: true, audioBooks: true },
        });

        if (!bookCase) {
            bookCase = await this.prisma.bookCase.create({
                data: {
                    userId: userId,
                    books: { connect: [] },        
                    audioBooks: { connect: [] },  
                },
                include: { books: true, audioBooks: true },
            });
        }

        if (isAudioBook) {
            await this.prisma.bookCase.update({
                where: { id: bookCase.id },
                data: {
                    audioBooks: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        } else {
            await this.prisma.bookCase.update({
                where: { id: bookCase.id },
                data: {
                    books: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        }
        
        return bookCase;
    }

    async showBookCase(userId: number) {
        const bookCase = this.prisma.bookCase.findUnique({
            where: {
                userId: userId
            },
            include: { books: true, audioBooks: true },
        });

        if (!bookCase) {
            throw new NotFoundException('Book case not found for this user.');
        }
        return bookCase;
    }

    async getLastReadBook(userId: number) {
        const lastReadBook = await this.prisma.readingProgress.findFirst({
            where: { userId },
            orderBy: { lastreading: 'desc' },  
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        bookCover: true,
                        analysis: {
                            select: {
                                id: true,
                                like_count: true,
                                comment_count: true,
                                read_count: true,
                            }
                        }
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        profile_image: true,
                    }
                }
            },
        });
        return lastReadBook;
    }
    
    
    async removeBookFromBookCase(bookId: number, userId: number, isAudioBook: boolean) {
        const bookCase =  await this.prisma.bookCase.findUnique({
            where:{
                userId: userId
            },
            include: {
                books: true,
                audioBooks: true
            },
        });

        if(!bookCase) {
            throw new NotFoundException('Book case not found');
        }

        if(isAudioBook) {
            const audioBookExists =  bookCase.audioBooks.some((audioBook) => audioBook.id === bookId);
            
            if(!audioBookExists) {
                throw new NotFoundException('This audiobook does not exist in the book case');
            }

            await this.prisma.bookCase.update({
                where: {
                    userId: userId
                },
                data:{
                    audioBooks: {
                        disconnect:{
                            id: bookId
                        },
                    }
                }
            });
        }
        else {
            const  bookExists = bookCase.books.some((book) => book.id === bookId);
            if(!bookExists) {
                throw new NotFoundException('This book does not exist in the book case');
            }

            await this.prisma.bookCase.update({
                where:{
                    userId: userId
                }, 
                data: {
                    books: {
                        disconnect: {
                            id: bookId
                        }
                    }
                }
            });
        }
        return { message: 'Book successfully removed from the book case.' };
    }
}