import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
@Injectable()
export class ReadingListService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookToReadingList(bookId: string, userId: number) {
        let readingList = await this.prisma.readingList.findUnique({
            where: { userId },
        });

        if (!readingList) {
            readingList = await this.prisma.readingList.create({
                data: {
                    userId,
                },
            });
        }

        const updatedReadingList = await this.prisma.readingList.update({
            where: { id: readingList.id }, 
            data: {
                books: {
                    connect: { id: parseInt(bookId, 10)},
                },
            },
            include: {
                books: true, 
            },
        });
        return updatedReadingList;
    }

    async showReadingList(userId: number) {
        const readingList = await this.prisma.readingList.findUnique({
            where: {
                userId: userId
            },
            include: { 
                books: {
                    include: {
                        analysis: {
                            select: {
                                read_count: true,
                                comment_count: true,
                                like_count: true,
                            },
                        },
                    },
                },
            },
        });

        if (!readingList) {
            throw new NotFoundException('Reading list not found for this user.');
        }
        return readingList;
    }

    async showUserReadingList(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const readingList = await this.prisma.readingList.findUnique({
            where: { userId: user.id },
            include: { 
                books: {
                    include: {
                        analysis: {
                            select: {
                                read_count: true,
                                comment_count: true,
                                like_count: true,
                            },
                        },
                    },
                },
            },
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