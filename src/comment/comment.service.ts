import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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
        });        
        return { message: 'Comment created successfully.', comment: comment };
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
        });
        return { message: 'Comment created successfully.', comment: comment };
    } 
    
    async createCommentByChapterId(bookId: string, chapterId: string, createCommentDto: CreateCommentDto, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        const chapter = await this.prisma.chapter.findUnique({
            where: { id: parseInt(chapterId, 10) },
        });
    
        if (!chapter) {
            throw new NotFoundException('This chapter does not exist. Please enter the correct chapter id.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: parseInt(bookId, 10),
                chapterId: parseInt(chapterId, 10),
                audioBookId: null,
                episodeId: null,
                userId: userId,
                publish_date: new Date(),
            },
        });
    
        return { message: 'Comment created successfully.', comment: comment };
    }

    async createCommentByEpisodeId(audioBookId: string, episodeId: string, createCommentDto: CreateCommentDto, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio  book does not exist. Please enter the correct audio book id.');
        }
    
        const chapter = await this.prisma.episodes.findUnique({
            where: { id: parseInt(episodeId, 10) },
        });
    
        if (!chapter) {
            throw new NotFoundException('This chapter does not exist. Please enter the correct chapter id.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: null,
                chapterId: null,
                audioBookId: parseInt(audioBookId, 10),
                episodeId: parseInt(episodeId, 10),
                userId: userId,
                publish_date: new Date(),
            },
        });
    
        return { message: 'Comment created successfully.', comment: comment };
    }
    
    async getAllCommentsByBookId(bookId: string){
        const comments = await this.prisma.comments.findMany({
            where:{
                bookId: parseInt(bookId, 10),
            },
        });

        if (!comments || (comments).length === 0) {
            throw new NotFoundException(`No comments found for bookId ${bookId}`);
        }
        return comments;
    }

    async getAllCommentsByAudioBookId(audioBookId: string){
        const comments = await this.prisma.comments.findMany({
            where:{
                audioBookId: parseInt(audioBookId, 10),
            },
        });

        if (!comments || (comments).length === 0) {
            throw new NotFoundException(`No comments found for audioBookId ${audioBookId}`);
        }
        return comments;
    }

    async getAllCommentsByChaptersId(bookId: string, chapterId: string){
        const comments = await this.prisma.comments.findMany({
            where:{
                bookId: parseInt(bookId, 10),
                chapterId: parseInt(chapterId, 10)
            },
        });

        if (!comments || (comments).length === 0) {
            throw new NotFoundException(`No comments found for book id ${bookId}, chapter id ${chapterId}`);
        }
        return comments;
    }

    async getAllCommentsByEpisodesId(audioBookId: string, episodesId: string){
        const comments = await this.prisma.comments.findMany({
            where:{
                audioBookId: parseInt(audioBookId, 10),
                episodeId: parseInt(episodesId, 10)
            },
        });

        if (!comments || (comments).length === 0) {
            throw new NotFoundException(`No comments found for audio book id ${audioBookId}, episodes id ${episodesId}`);
        }
        return comments;
    }

    async deleteCommentsByBookId(bookId: string, commentId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.delete({
            where: {
                id: parseInt(commentId, 10),
            },
        });
        return { message: 'Comment deleted successfully.' };
    }

    async deleteCommentsByAudioBookId(audioBookId: string, commentId: string, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio  book does not exist. Please enter the correct audio book id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.delete({
            where: {
                id: parseInt(commentId, 10),
            },
        });
        return { message: 'Comment deleted successfully.' };
    }

    async deleteCommentsByChapterId(bookId: string, chapterId: string, commentId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }

        const chapter = await this.prisma.chapter.findUnique({
            where: { id: parseInt(chapterId, 10) },
        });
    
        if (!chapter) {
            throw new NotFoundException('This chapter does not exist. Please enter the correct chapter id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.delete({
            where: {
                id: parseInt(commentId, 10),
            },
        });
        return { message: 'Comment deleted successfully.' };
    }

    async deleteCommentsByEpisodesId(audioBookId: string, episodesId: string, commentId: string, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio  book does not exist. Please enter the correct audio book id.');
        }

        const episode = await this.prisma.episodes.findUnique({
            where: { id: parseInt(episodesId, 10) },
        });
    
        if (!episode) {
            throw new NotFoundException('This episode does not exist. Please enter the correct episode id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.delete({
            where: {
                id: parseInt(commentId, 10),
            },
        });
        return { message: 'Comment deleted successfully.' };
    }

    async updateCommentsByBookId(bookId: string, commentId: string, updateData: any, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.updateMany({
            where: {
                id: parseInt(commentId, 10),
            },
            data: updateData,
        });
        return { message: 'Comment updated successfully.' };
    }

    async updateCommentsByAudioBookId(audioBookId: string, commentId: string, updateData: any, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio  book does not exist. Please enter the correct audio book id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }
    
        await this.prisma.comments.updateMany({
            where: {
                id: parseInt(commentId, 10),
            },
            data: updateData,
        });
        return { message: 'Comment updated successfully.' };
    }

    async updateCommentsByChapterId(bookId: string, chapterId: string, commentId: string, updateData: any, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }

        const chapter = await this.prisma.chapter.findUnique({
            where: { id: parseInt(chapterId, 10) },
        });
    
        if (!chapter) {
            throw new NotFoundException('This chapter does not exist. Please enter the correct chapter id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }

        await this.prisma.comments.updateMany({
            where: {
                id: parseInt(commentId, 10),
            },
            data: updateData,
        });
        return { message: 'Comment updated successfully.' };
    }

    async updateCommentsByEpisodesId(audioBookId: string, episodesId: string, commentId: string, updateData: any, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio  book does not exist. Please enter the correct audio book id.');
        }

        const episode = await this.prisma.chapter.findUnique({
            where: { id: parseInt(episodesId, 10) },
        });
    
        if (!episode) {
            throw new NotFoundException('This episode does not exist. Please enter the correct episode id.');
        }
    
        const comment = await this.prisma.comments.findUnique({
            where: { id: parseInt(commentId, 10) },
        });
    
        if (!comment) {
            throw new NotFoundException('This comment does not exist. Please enter the correct comment id.');
        }
    
        if (comment.userId !== userId) {
            throw new ForbiddenException('You are not the author of this comment. You cannot delete this comment.');
        }

        await this.prisma.comments.updateMany({
            where: {
                id: parseInt(commentId, 10),
            },
            data: updateData,
        });
        return { message: 'Comment updated successfully.' };
    }
}