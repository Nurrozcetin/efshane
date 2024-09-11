import { User } from '@prisma/client';
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ReadingListService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookToreadingList(bookId: string, userId: number, isAudioBook: boolean) {
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

        let readingList = await this.prisma.readingList.findFirst({
            where: { userId: userId },
            include: { books: true, audioBooks: true },
        });

        if (!readingList) {
            readingList = await this.prisma.readingList.create({
                data: {
                    userId: userId,
                    books: { connect: [] },        
                    audioBooks: { connect: [] },  
                },
                include: { books: true, audioBooks: true },
            });
        }

        if (isAudioBook) {
            await this.prisma.readingList.update({
                where: { id: readingList.id },
                data: {
                    audioBooks: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        } else {
            await this.prisma.readingList.update({
                where: { id: readingList.id },
                data: {
                    books: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        }
        
        return readingList;
    }

    async showLReadingList(userId: number) {
        const readingList = this.prisma.readingList.findUnique({
            where: {
                userId: userId
            },
            include: { books: true, audioBooks: true },
        });

        if (!readingList) {
            throw new NotFoundException('Reading list not found for this user.');
        }
        return readingList;
    }

    async removeBookFromreadingList(bookId: number, userId: number, isAudioBook: boolean) {
        const readingList =  await this.prisma.readingList.findUnique({
            where:{
                userId: userId
            },
            include: {
                books: true,
                audioBooks: true
            },
        });

        if(!readingList) {
            throw new NotFoundException('Reading list not found');
        }

        if(isAudioBook) {
            const audioBookExists =  readingList.audioBooks.some((audioBook) => audioBook.id === bookId);
            
            if(!audioBookExists) {
                throw new NotFoundException('This audiobook does not exist in the reading list');
            }

            await this.prisma.readingList.update({
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
            const bookExists = readingList.books.some((book) => book.id === bookId);
            if(!bookExists) {
                throw new NotFoundException('This book does not exist in the reading list');
            }

            await this.prisma.readingList.update({
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
        return { message: 'Book successfully removed from the reading list.' };
    }
}