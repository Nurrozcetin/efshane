import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService{
    constructor(private readonly prisma:PrismaService) {}     
    async createCommentByBookId(bookId: string, createCommentDto: CreateCommentDto, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: parseInt(bookId, 10),
                chapterId: null,
                audioBookId: null,
                episodeId: null,
                userId,  
                publish_date: new Date(),
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
            },
        });        
        return {
            message: 'Comment created successfully.',
            comment: {
                id: comment.id,
                content: comment.content,
                user: {
                    username: comment.user.username,
                    profile_image: comment.user.profile_image,
                },
            },
        };
    } 
    
    async createCommentByAudioBookId(audioBookId: string, createCommentDto: CreateCommentDto, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: null,
                chapterId: null,
                audioBookId: parseInt(audioBookId, 10),
                episodeId: null,
                userId: userId,
                publish_date: new Date(),
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
            },
        });
        return {
            message: 'Comment created successfully.',
            comment: {
                id: comment.id,
                content: comment.content,
                user: {
                    username: comment.user.username,
                    profile_image: comment.user.profile_image,
                },
                publish_date: comment.publish_date,
            },
        };
    } 
    
    async createCommentByChapterId(
        decodedTitle: string,
        decodedChapterTitle: string,
        createCommentDto: CreateCommentDto,
        userId: number
    ) {
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
        const decodedNormalizedChapterTitle = normalizeTitle(decodedChapterTitle);
    
        if (!decodedTitle || !decodedChapterTitle) {
            throw new BadRequestException("Title and chapter title are required.");
        }
    
        const books = await this.prisma.book.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });
    
        const userBook = books.find(book => book.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This book does not exist. Please enter the correct title.");
        }
    
        if (userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.');
        }
    
        const chapter = await this.prisma.chapter.findFirst({
            where: {
                normalizedTitle: decodedNormalizedChapterTitle, 
                bookId: userBook.id,
            },
        });
    
        if (!chapter) {
            throw new NotFoundException('This chapter does not exist for the specified book.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: userBook.id,
                chapterId: chapter.id,
                userId: userId,
                publish_date: new Date(),
            },
            include: {
                user: true,
            },
        });
    
        return {
            message: 'Comment created successfully.',
            comment: {
                id: comment.id,
                content: comment.content,
                user: {
                    username: comment.user.username,
                    profile_image: comment.user.profile_image,
                },
            },
        };
    }

    async createCommentByEpisodeTitle(decodedTitle: string, decodedEpisodeTitle: string, createCommentDto: CreateCommentDto, userId: number) {
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
        const decodedNormalizedEpisodeTitle = normalizeTitle(decodedEpisodeTitle);
    
        if (!decodedTitle || !decodedEpisodeTitle) {
            throw new BadRequestException("Title and episode title are required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });
    
        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }
    
        if (userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add episodes.');
        }
    
        const episode = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: decodedNormalizedEpisodeTitle, 
                audiobookId: userBook.id,
            },
        });
    
        if (!episode) {
            throw new NotFoundException('This episode does not exist for the specified audio book.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                audioBookId: userBook.id,
                episodeId: episode.id,
                userId: userId,
                publish_date: new Date(),
            },
            include: {
                user: true,
            },
        });
    
        return {
            message: 'Comment created successfully.',
            comment: {
                id: comment.id,
                content: comment.content,
                user: {
                    username: comment.user.username,
                    profile_image: comment.user.profile_image,
                },
            },
        };
    }
}