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

    async updateCategoriesForBook(bookId: number, categoryIds: number[]) {
        await this.prisma.bookCategory.deleteMany({
            where: { bookId },
        });

        const bookCategories = categoryIds.map((categoryId) => ({
            bookId,
            categoryId
        }));

        await this.prisma.bookCategory.createMany({
            data: bookCategories,
        });
        
        return { message: 'Categories updated for book successfully.' }; 
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

    async updateCategoriesForAudioBook(audioBookId: number, categoryIds: number[]) {
        await this.prisma.audioBookCategory.deleteMany({
            where: { audioBookId },
        });

        const audioBookCategories = categoryIds.map((categoryId) => ({
            audioBookId,
            categoryId
        }));

        await this.prisma.audioBookCategory.createMany({
            data: audioBookCategories,
        });
        
        return { message: 'Categories updated for audio book successfully.' }; 
    }

    async findUserIdByEmail(email: string){
        if (!email) {
            throw new Error("Email değeri boş olamaz.");
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email: email 
            },
            select: {
                id: true
            },    
        });
        if (!user) {
            throw new Error('User not found'); 
        }
        return user.id; 
    }

    async assignCategoriesToUser(email: string, categoryIds: number[]) {
        if (!email || typeof email !== 'string') {
            throw new Error("Geçersiz kullanıcı e-postası.");
        }
    
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            throw new Error("Geçersiz veya boş kategori ID'leri.");
        }
    
        const userId = await this.findUserIdByEmail(email);
    
        if (!userId) {
            throw new Error("Kullanıcı bulunamadı.");
        }
    
        const userCategories = categoryIds.map((categoryId) => ({
            userId,
            categoryId,
        }));
    
        await this.prisma.userCategory.createMany({
            data: userCategories,
        });
    
        return { message: 'Kategoriler kullanıcıya başarıyla atandı.' };
    }
    
    async getCategoriesByUser(email: string) {
        const userId = await this.findUserIdByEmail(email);
        return this.prisma.userCategory.findMany({
            where: {
                userId
            },
            include:{
                category: true
            }
        });
    }

    async getAllCategories() {
        return await this.prisma.category.findMany(); 
    }
}