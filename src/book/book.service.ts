import { TestingModule } from '@nestjs/testing';
import { AudioBook } from './../../node_modules/.prisma/client/index.d';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import axios from 'axios';
import { LibraryService } from "src/library/library.service";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Prisma } from '@prisma/client';
@Injectable()
export class BookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly libraryService: LibraryService,
    ) {}
    async createBook(
        bookDto: CreateBookDto,
        userId: string,
    ) {
        const { title, summary, bookCover, hashtags, normalizedTitle, categories, ageRange, bookCopyright, isAudioBook} = bookDto;

        const userID = parseInt(userId);
        const existingBookTitle = await this.prisma.book.findUnique({
            where: {
                title,
            },
        });
    
        if (existingBookTitle) {
            throw new Error('A book with this title already exists. Please choose a different title.');
        }

        const bookCopyRight = parseInt(bookCopyright);
        const ageRangeId = parseInt(ageRange);
        const categoryId = parseInt(categories);

        const encodeTitle = encodeURIComponent(title);
        const decodedTitle = decodeURIComponent(encodeTitle);

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
        
        const book = await this.prisma.book.create({
            data: {
                title,
                summary,
                bookCover,
                isAudioBook,
                normalizedTitle: decodedNormalizedTitle,
                userId: userID,
                publish : false,
                publish_date: new Date(),
                hashtags: {
                    create: (Array.isArray(hashtags) ? hashtags : []).map((tag: string) => ({
                        hashtag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag },
                            },
                        },
                    })),
                },
                categories: {
                    create: {
                        category: {
                            connect: { id: categoryId },
                        },
                    }
                },
                ageRange: {
                    create: {
                        range: {
                            connect: { id: ageRangeId }, 
                        },
                    },
                },
                bookCopyright: {
                    create: {
                        copyright: {
                            connect: { id: bookCopyRight }, 
                        },
                    },
                }
            },
        });
        
        await this.libraryService.addBookToLibrary(book.id.toString(), userID, false);
        return book;
    }

    // private async generateBookCover(title: string, summary: string) {
    //     try {
    //         const response = await this.axios.post('http://localhost:8000/generate', {
    //             title,
    //             summary,
    //         });

    //         return response.data.image_path;
    //     } catch (error) {
    //         console.error('Görsel oluşturma hatası:', error.message);
    //         throw new Error('Görsel oluşturulamadı.');
    //     }
    // }
    
    async getBookByTitle(decodedTitle: string, userId: number) {
        try {
            const normalizeTitle = (title: string) => {
                return title
                    .toLowerCase() 
                    .normalize('NFC') 
                    .replace(/[\u0300-\u036f]/g, '') 
                    .trim() 
                    .replace(/\s+/g, ' '); 
            };
            
            const decodedNormalizedTitle = normalizeTitle(decodedTitle);

            if (!decodedTitle) {
                throw new BadRequestException("Title parameter is required.");
            }
        
            const books = await this.prisma.book.findMany({
                where: {
                    OR: [
                        { normalizedTitle: decodedNormalizedTitle },
                        { title: decodedTitle },
                    ],
                    userId: userId,
                },
                include: {
                    ageRange: {
                        select: {
                            rangeId: true,
                        }
                    },
                    bookCopyright: {
                        select: {
                            bookCopyrightId: true,
                        },
                    },
                    categories: {
                        select: {
                            categoryId: true,
                        }
                    },
                    hashtags: {
                        select: {
                            hashtag: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                },
            });        
    
            const userBook = books.find(book => book.userId === userId);
        
            if (!userBook) {
                throw new NotFoundException("This book does not exist. Please enter the correct title.");
            }
            return userBook;
        } catch (error) {
            console.error('Kitap alınamadı:', error);
            throw error; 
        }
    }
    
    async deleteBook(bookId: string, userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist. Please enter the correct book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot delete chapters.');
        }
        await this.prisma.book.delete({
            where: { id: parseInt(bookId, 10) },
        });
    
        return { message: 'Book deleted successfully.' };
    }

    async updateBook(decodedTitle: string, bookDto: UpdateBookDto, userId: number) {
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

        if (!decodedNormalizedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const books = await this.prisma.book.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedNormalizedTitle },
                ],
                userId: userId,
            },
        });        

        const userBook = books.find(book => book.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This book does not exist. Please enter the correct title.");
        }
    
        let hashtagsData = {};
        if (bookDto.hashtags && Array.isArray(bookDto.hashtags)) {
            hashtagsData = {
                hashtags: {
                    deleteMany: {},
                    create: bookDto.hashtags.map((tag: string) => ({
                        hashtag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag },
                            },
                        },
                    })),
                },
            };
        }
    
        let ageRangeData = {};
        if (bookDto.ageRange && typeof bookDto.ageRange === 'string') {
            ageRangeData = {
                ageRange: {
                    deleteMany: {},
                    create: [
                        {
                            range: { connect: { id: parseInt(bookDto.ageRange) } },
                        },
                    ],
                },
            };
        }

        let categoryData = {};
        if (bookDto.categories && typeof bookDto.categories === 'string') {
            categoryData = {
                categories: {
                    deleteMany: {},
                    create: [
                        {
                            category: { connect: { id: parseInt(bookDto.categories) } },
                        },
                    ],
                },
            };
        }

        let copyrightData = {};
        if (bookDto.bookCopyright && typeof bookDto.bookCopyright === 'string') {
            copyrightData = {
                bookCopyright: {
                    deleteMany: {},
                    create: [
                        {
                            copyright: { connect: { id: parseInt(bookDto.bookCopyright) } },
                        },
                    ],
                },
            };
        }


        if(bookDto.title && bookDto.title !== bookDto.title) {
            const existingNewBook = await this.prisma.book.findUnique({
                where: { title: bookDto.title },
            });
            if (existingNewBook) {
                throw new ConflictException('Bu başlık zaten mevcut.');
            }
        }

        const updatedBook = await this.prisma.book.update({
            where: { id:userBook.id }, 
            data: {
                title: bookDto.title,
                summary: bookDto.summary,
                normalizedTitle: normalizeTitle(bookDto.title),
                bookCover: bookDto.bookCover,
                isAudioBook: bookDto.isAudioBook,
                ...hashtagsData,
                ...categoryData,
                ...ageRangeData,
                ...copyrightData,
            },
            include: {
                ageRange: true,
                bookCopyright: true,
                categories: true,
                hashtags: {
                    select: {
                        hashtag: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        return updatedBook;
    }

    async search(query: string) {
        const books = await this.prisma.book.findMany({
            where: {
                    title: { contains: query, mode: 'insensitive' },
                },
                select: {
                    id: true,
                    title: true,
                    bookCover: true,
                    user:{
                        select: {
                            username: true,
                        }
                    }
                }
        });
        const users = await this.prisma.user.findMany({
            where: {
                username: { contains: query, mode: 'insensitive' },
            },
            select: {
                id: true,
                username: true,
                profile_image: true,
            },
        });
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                title: { contains: query, mode: 'insensitive' },
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                    }
                }
            }
        })
        return { books, users, audioBooks };
    }

    async getTrendsBook() {
        const books = await this.prisma.book.findMany({
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                },
                analysis: {
                    select: {
                        read_count: true,
                    }
                }
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`Trend kitap bulunamadı`);
        }
    
        books.sort((a, b) => {
            const aReadCount = a.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0);
            const bReadCount = b.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0);
            return bReadCount - aReadCount;
        });
    
        return books;
    }

    async getAllBook() {
        const currentYear = new Date().getFullYear();
        const books = await this.prisma.book.findMany({
            where: {
                publish_date: {
                    gte: new Date(`${currentYear}-01-01`), 
                    lt: new Date(`${currentYear + 1}-01-01`), 
                },
            },
            orderBy: { publish_date: 'desc' },
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                }
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`Bu yıl yayınlanan kitap bulunamadı`);
        }
        return books;
    }

    async getAgeRange() {
        try {
            const ageRange = await this.prisma.range.findMany({
                select: {
                    id: true,
                    range: true,
                }
            });
            return ageRange;
        } catch (error) {
            console.error('Veri alırken hata oluştu:', error);
            throw new Error('Yaş aralıkları alınamadı');
        }
    }

    async getCopyRight() {
        try {
            const copyright = await this.prisma.copyright.findMany({
                select: {
                    id: true,
                    copyright: true,
                }
            });
            return copyright;
        } catch (error) {
            console.error('Veri alırken hata oluştu:', error);
            throw new Error('Telif hakkı verileri alınamadı');
        }
    }

    async getBooksByAuthorId(authorId: number) {
        const baseUrl = 'http://localhost:5173'; 
        const books = await this.prisma.book.findMany({
            where: {
                userId: authorId,
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                publish_date: true,
                publish: true,
                isAudioBook: true,
                analysis: {
                    select: {
                        read_count: true,
                        comment_count: true,
                        like_count: true,
                    },
                },
            },
        });

        const formattedBooks = books.map((book) => ({
            ...book,
            bookCover: `${baseUrl}/${book.bookCover}`,
        }));
        return formattedBooks;
    }

    async togglePublish(
        decodedTitle: string,
        userId: number,
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
        
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
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

        const updatedBook = await this.prisma.book.update({
            where: {
                id: userBook.id,
            },
            data: {
                publish: !userBook.publish, 
            },
        });
    
        return updatedBook;
    }  

    async getBookByAuthorUsername(username: string) {
        const baseUrl = 'http://localhost:5173'; 
        const books = await this.prisma.book.findMany({
            where: {
                user: {
                    username: username,
                },
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                publish_date: true,
                publish: true,
                isAudioBook: true,
                analysis: {
                    select: {
                        read_count: true,
                        comment_count: true,
                        like_count: true,
                    },
                },
                user: {
                    select: {
                        username: true,
                    }
                }
            },
        });  
        const formattedBooks = books.map((book) => ({
            ...book,
            bookCover: `${baseUrl}/${book.bookCover}`,
        }));
        return formattedBooks;
    }
}