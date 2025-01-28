import { User } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class BookCaseService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookBookCase(decodedBookTitle: string, userId: number) {
        try {
            const normalizeTitle = (title: string) => {
                return title
                    .toLowerCase() 
                    .normalize('NFC') 
                    .replace(/[\u0300-\u036f]/g, '') 
                    .trim() 
                    .replace(/\s+/g, ' '); 
            };
            
            const decodedNormalizedTitle = normalizeTitle(decodedBookTitle);
    
            if (!decodedBookTitle) {
                throw new BadRequestException("Title parameter is required.");
            }
                
            const book = await this.prisma.book.findFirst({
                where: {
                    OR: [
                        { title: decodedNormalizedTitle }, 
                        { normalizedTitle: decodedNormalizedTitle }
                    ]
                },
            });
    
            if (!book) {
                throw new BadRequestException("Kitap bulunamadı.");
            }
    
            const existingEntry = await this.prisma.bookCase.findFirst({
                where: {
                    userId: userId,
                    bookId: book.id,
                },
            });
    
            if (existingEntry) {
                await this.prisma.bookCase.delete({
                    where: {
                        id: existingEntry.id,
                    },
                });
                return { message: 'Kitap kütüphaneden çıkarıldı.' };
            }
    
            await this.prisma.bookCase.create({
                data: {
                    userId: userId,
                    bookId: book.id,
                },
            });
    
            return { message: 'Kitap kütüphaneye eklendi.' };
    
        } catch (error) {
            console.error('Error in addBookBookCase:', error);
            throw new BadRequestException('Bir hata oluştu.');
        }
    }
    
    async addAudioBookBookCase(decodedAudioBookTitle: string, userId: number) {
        try {
            const normalizeTitle = (title: string) => {
                return title
                    .toLowerCase() 
                    .normalize('NFC') 
                    .replace(/[\u0300-\u036f]/g, '') 
                    .trim() 
                    .replace(/\s+/g, ' '); 
            };
            
            const decodedNormalizedTitle = normalizeTitle(decodedAudioBookTitle);

            if (!decodedAudioBookTitle) {
                throw new BadRequestException("Title parameter is required.");
            }

            console.log('decodedAudioBookTitle:', decodedAudioBookTitle);
            const audioBook = await this.prisma.audioBook.findFirst({
                where: {
                    OR: [
                        { normalizedTitle: decodedNormalizedTitle },
                        { title: decodedNormalizedTitle },
                    ],
                },
            });
        
            const existingEntry = await this.prisma.audioBookCase.findFirst({
                where: {
                    userId: userId,
                    audioBookId: audioBook.id,
                },
            });
    
            if (existingEntry) {
                await this.prisma.audioBookCase.delete({
                    where: {
                        id: existingEntry.id,
                    },
                });
                return { message: 'Sesli kitap kütüphaneden çıkarıldı.' };
            }
    
            await this.prisma.audioBookCase.create({
                data: {
                    userId: userId,
                    audioBookId: audioBook.id,
                },
            });
    
            return { message: 'Sesli kitap kütüphaneye eklendi.' };
    
        } catch (error) {
            console.error('Error in addAudioBookBookCase:', error);
            throw new BadRequestException('Bir hata oluştu.');
        }
    } 
    
    async getLastReadBook(userId: number) {
        const lastReadBook = await this.prisma.bookCase.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                createdAt: true, 
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
    
        const lastListenAudioBook = await this.prisma.audioBookCase.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                createdAt: true, 
                audioBooks: {
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
        return allBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }

    async getBooks(authorId: number) {
        const books = await this.prisma.bookCase.findMany({
            where: {
                userId: authorId,
            },
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
    
        const audioBooks = await this.prisma.audioBookCase.findMany({
            where: {
                userId: authorId,
            },
            select: {
                audioBooks: {
                    select: {
                        id: true,
                        title: true,
                        bookCover: true,
                    },
                },
            },
        });
    
        const formattedBooks = books.map((bookWrapper) => ({
            ...bookWrapper.book,
            type: 'book', 
        }));
    
        const formattedAudioBooks = audioBooks.map((audioBookWrapper) => ({
            ...audioBookWrapper.audioBooks,
            type: 'audioBook', 
        }));
    
        const allItems = [...formattedBooks, ...formattedAudioBooks];
        console.log('allItems:', allItems);
    
        return allItems;
    }
    
}