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

    async findUserIdById(userId: number){
        if (!userId) {
            throw new Error("userId değeri boş olamaz.");
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
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
    
    async getCategoriesByUser(userId: number) {
        const suggestions = await this.prisma.userCategory.findMany({
            where: {
                userId
            },
            include:{
                category: {
                    select: {
                        bookCategories: {
                            select: {
                                book: {
                                    select: {
                                        id: true,
                                        title: true,
                                        bookCover: true,
                                        user: {
                                            select: {
                                                id: true,
                                                username: true,
                                                profile_image: true,
                                            },
                                        },
                                        analysis: {
                                            select: {
                                                read_count: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                },
            },
        });

        const books = suggestions.flatMap(suggestion =>
            suggestion.category.bookCategories.map(book => ({
                id: book.book.id,
                title: book.book.title,
                bookCover: book.book.bookCover,
                readCount: book.book.analysis.reduce((acc, item) => acc + (item.read_count || 0), 0),
                username: book.book.user.username,
                profile_image: book.book.user.profile_image
            }))
        );
        
        books.sort((a, b) => b.readCount - a.readCount);
        return books;        
    }

    async getAllCategories() {
        return await this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true,
            },
        }); 
    }


    async getBookByCategories(categoryName: string) {
        try {
            if (!categoryName) {
                throw new Error("Kategori adı geçerli değil.");
            }
    
            const booksByCategories = await this.prisma.category.findUnique({
                where: {
                    name: categoryName,
                },
                select: {
                    name: true,
                    bookCategories: {
                        select: {
                            book: {
                                select: {
                                    id: true,
                                    title: true,
                                    bookCover: true,
                                    user: {
                                        select: {
                                            username: true,
                                            profile_image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
    
            if (!booksByCategories || !booksByCategories.bookCategories || booksByCategories.bookCategories.length === 0) {
                throw new Error("Kategori bulunamadı veya bu kategoriye ait kitap yok.");
            }
    
            const baseUrl = 'http://localhost:5173'; 
            const books = booksByCategories.bookCategories.reduce((acc, bookCategory) => {
                const book = bookCategory.book;
                if (book) {
                    acc.push({
                        id: book.id,
                        title: book.title,
                        bookCover: `${baseUrl}/${book.bookCover}`, 
                        username: book.user.username,
                        profile_image: `${baseUrl}/${book.user.profile_image}`, 
                    });
                }
                return acc;
            }, []);
            console.log("Kategori detayları:", books);
            return books;
        } catch (error) {
            console.error("Hata:", error);
            throw new Error("Kitapları getirirken bir hata oluştu."); 
        }
    }
}
