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
                content:  createCommentDto.content,
                bookId: parseInt(bookId, 10),
                sectionId: createCommentDto.sectionId || null,
                userId: userId,
            },
        });
        return { message: 'Comment created successfully.', comment: comment };
    }       
    
    async createCommentBySectionId(bookId: string, sectionId: string, createCommentDto: CreateCommentDto, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        const section = await this.prisma.section.findUnique({
            where: { id: parseInt(sectionId, 10) },
        });
    
        if (!section) {
            throw new NotFoundException('This section does not exist. Please enter the correct section id.');
        }
    
        const comment = await this.prisma.comments.create({
            data: {
                content: createCommentDto.content,
                bookId: parseInt(bookId, 10),
                sectionId: parseInt(sectionId, 10),
                userId: userId,
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

    async getAllCommentsBySectionsId(bookId: string, sectionId: string){
        const comments = await this.prisma.comments.findMany({
            where:{
                bookId: parseInt(bookId, 10),
                sectionId: parseInt(sectionId, 10)
            },
        });

        if (!comments || (comments).length === 0) {
            throw new NotFoundException(`No comments found for book id ${bookId}, section id ${sectionId}`);
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

    async deleteCommentsBySectionId(bookId: string, sectionId: string, commentId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }

        const section = await this.prisma.section.findUnique({
            where: { id: parseInt(sectionId, 10) },
        });
    
        if (!section) {
            throw new NotFoundException('This section does not exist. Please enter the correct section id.');
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

    async updateCommentsBySectionId(bookId: string, sectionId: string, commentId: string, updateData: any, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }

        const section = await this.prisma.section.findUnique({
            where: { id: parseInt(sectionId, 10) },
        });
    
        if (!section) {
            throw new NotFoundException('This section does not exist. Please enter the correct section id.');
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