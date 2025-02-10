import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { title } from "process";
@Injectable()
export class ReadingListService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookToReadingList(bookId: string, userId: number, name: string) {
        try {
            const existingEntry = await this.prisma.readingList.findFirst({
                where: {
                    userId: userId,
                    bookId: parseInt(bookId),
                },
            });
        
            if (existingEntry) {
                await this.prisma.readingList.delete({
                    where: {
                        id: existingEntry.id,
                    },
                });
                return { message: 'Kitap okuma listesinden çıkarıldı.' };
            }
        
            await this.prisma.readingList.create({
                data: {
                    name: name,
                    userId: userId,
                    bookId: parseInt(bookId),
                },
            });
            return { message: 'Kitap okuma listesine eklendi.' };

        } catch (error) {
            console.error('Error in addBookToReadingList:', error);
            throw new BadRequestException('Bir hata oluştu.');
        }
    }

    async addBookToListeningList(audioBookId: string, userId: number, name: string) {
        try {
            const existingEntry = await this.prisma.listeningList.findFirst({
                where: {
                    userId: userId,
                    audioBookId: parseInt(audioBookId),
                },
            });
        
            if (existingEntry) {
                await this.prisma.listeningList.delete({
                    where: {
                        id: existingEntry.id,
                    },
                });
                return { message: 'Sesli kitap okuma listesinden çıkarıldı.' };
            }
        
            await this.prisma.listeningList.create({
                data: {
                    name: name,
                    userId: userId,
                    audioBookId: parseInt(audioBookId),
                },
            });
        
            return { message: 'Sesli itap okuma listesine eklendi.' };

        } catch (error) {
            console.error('Error in addBookToListeningList:', error);
            throw new BadRequestException('Bir hata oluştu.');
        }
    }

    async getLastReadBook(userId: number) {
        const lastReadBook = await this.prisma.readingList.findFirst({
            where: { userId },
            orderBy: { addedAt: 'desc' },
            select: {
                addedAt: true, 
                name: true,
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
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profile_image: true,
                            },
                        },
                    },
                },
            },
        });
    
        const lastListenAudioBook = await this.prisma.listeningList.findFirst({
            where: { userId },
            orderBy: { addedAt: 'desc' },
            select: {
                addedAt: true, 
                name: true,
                audioBook: {
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
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profile_image: true,
                            },
                        },
                    },
                },
            },
        });
    
        const allBooks = [
            lastReadBook ? { ...lastReadBook, type: 'book' } : null,
            lastListenAudioBook ? { ...lastListenAudioBook, type: 'audioBook' } : null,
        ].filter(Boolean);
        return allBooks.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())[0]; 
    }

    async getReadingList(userId: number) {
        const lists = await this.prisma.readingList.groupBy({
            by: ['name'],
            where: { userId },
            _count: {
                bookId: true,
            },
        });
    
        const listsWithCovers = await Promise.all(
            lists.map(async (list) => {
                const firstBook = await this.prisma.readingList.findFirst({
                    where: { userId, name: list.name },
                    select: {
                        book: {
                            select: {
                                bookCover: true,
                            },
                        },
                    },
                    orderBy: { addedAt: 'asc' }, 
                });
    
                return {
                    ...list,
                    cover: firstBook?.book?.bookCover || 'default-book-cover.jpg',
                };
            })
        );
    
        return listsWithCovers;
    }
    

    async getBooksInList(userId: number, listName: string) {
        return await this.prisma.readingList.findMany({
            where: { userId, name: listName },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        bookCover: true,
                    },
                },
            },
        });
    }
}