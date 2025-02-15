import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Progress } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ProgressService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createOrUpdateBookProgress(userId: number, decodedTitle: string, chapterId: number,
    ): Promise<Progress> {
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase()
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ş/g, 's')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
    
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const book = await this.prisma.book.findFirst({
            where: {
                normalizedTitle: decodedNormalizedTitle,
            },
            select: {
                id: true,
                title: true,
                like: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const audioBook = await this.prisma.audioBook.findFirst({
            where: {
                normalizedTitle: decodedNormalizedTitle,
            },
            select: {
                id: true,
                title: true,
                like: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if(book) {
            return await this.prisma.progress.upsert({
                where: {
                    userId_bookId: {
                        userId: userId,
                        bookId: book.id,
                    },
                },
                create: {
                    userId: userId,
                    bookId: book.id,
                    chapterId: chapterId,
                    lastAccessed: new Date(),
                },
                update: {
                    chapterId: chapterId,
                    lastAccessed: new Date(),
                },
            });
        }else if(audioBook){
            return await this.prisma.progress.upsert({
                where: {
                    userId_audioBookId: {
                        userId: userId,
                        audioBookId: audioBook.id,
                    },
                },
                create: {
                    userId: userId,
                    audioBookId: audioBook.id,
                    episodeId: chapterId,
                    lastAccessed: new Date(),
                },
                update: {
                    episodeId: chapterId,
                    lastAccessed: new Date(),
                },
            });
        }
    }
    
    async getLastReadChapter(userId: number, decodedTitle: string) {
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase()
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ş/g, 's')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
    
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBook = await this.prisma.audioBook.findFirst({
            where: {
                normalizedTitle: decodedNormalizedTitle,
            },
            select: {
                id: true,
                title: true,
                like: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    
        const book = await this.prisma.book.findFirst({
            where: {
                normalizedTitle: decodedNormalizedTitle,
            },
            select: {
                id: true,
                title: true,
                like: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    
        if (!book && !audioBook) {
            throw new NotFoundException(`Book or audiobook with title '${decodedTitle}' not found.`);
        }
    
        let chapters = null;
        if (book) {
            chapters = await this.prisma.progress.findFirst({
                where: {
                    userId: userId,
                    bookId: book.id,
                },
                include: {
                    chapter: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            image: true,
                            analysis: {
                                select: {
                                    like_count: true,
                                    comment_count: true,
                                    read_count: true,
                                },
                            },
                            comments: {
                                orderBy: { id: 'desc' },
                                select: {
                                    id: true,
                                    content: true,
                                    user: {
                                        select: {
                                            username: true,
                                            profile_image: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    lastAccessed: 'desc',
                },
            });
        }
    
        let episodes = null;
        if (audioBook) {
            episodes = await this.prisma.progress.findFirst({
                where: {
                    userId: userId,
                    audioBookId: audioBook.id,
                },
                include: {
                    episode: {
                        select: {
                            id: true,
                            title: true,
                            audioFile: true,
                            image: true,
                            analysis: {
                                select: {
                                    like_count: true,
                                    comment_count: true,
                                    read_count: true,
                                },
                            },
                            comments: {
                                orderBy: { id: 'desc' },
                                select: {
                                    id: true,
                                    content: true,
                                    user: {
                                        select: {
                                            username: true,
                                            profile_image: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    lastAccessed: 'desc',
                },
            });
        }
    
        if (!chapters && !episodes) {
            return null;
        }
    
        return {
            book: book ? { id: book.id, title: book.title } : null,
            chapters: chapters?.chapter || null,
            audioBook: audioBook ? { id: audioBook.id, title: audioBook.title } : null,
            episodes: episodes?.episode || null,
        };
    }
    
}