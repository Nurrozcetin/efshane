import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService
    ){}

    async assignCategoriesToBook(bookId: number, categoryIds: number[]){
        const bookCategories = categoryIds.map((categoryId) => ({
            bookId,
            categoryId
        }))

        await this.prisma.bookCategory.createMany({
            data: bookCategories,
        });

        return {message : 'Categories assigned to book successfully.' };
    }

    async getCategoriesByBook(bookId: number) {
        return this.prisma.bookCategory.findMany({
            where: {
                bookId
            },
            include:{
                category: true
            }
        });
    }

    async assignCategoriesToAudioBook(audioBookId: number, categoryIds: number[]){
        const audioBookCategories = categoryIds.map((categoryId) => ({
            audioBookId,
            categoryId
        }))

        await this.prisma.audioBookCategory.createMany({
            data: audioBookCategories,
        });

        return {message : 'Categories assigned to audio book successfully.' };
    }

    async getCategoriesByAudioBook(audioBookId: number) {
        return this.prisma.audioBookCategory.findMany({
            where: {
                audioBookId
            },
            include:{
                category: true
            }
        });
    }
}