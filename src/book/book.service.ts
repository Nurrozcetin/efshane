import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { LibraryService } from "src/library/library.service";
import { UpdateAudioBookDto } from "src/audio-book/dto/update-audiobook.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

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
        const { title, summary, bookCover, hashtags, categories, ageRange, bookCopyright, isAudioBook} = bookDto;

        const userID = parseInt(userId);
        const existingBookTitle = await this.prisma.book.findUnique({
            where: {
                title,
            },
        });
    
        if (existingBookTitle) {
            throw new Error('A book with this title already exists. Please choose a different title.');
        }

        const existingBookSummary = await this.prisma.book.findUnique({
            where: {
                summary,
            },
        });
    
        if (existingBookSummary) {
            throw new Error('A book with this summary already exists. Please change your books summary.');
        }

        const bookCopyRight = parseInt(bookCopyright);
        const ageRangeId = parseInt(ageRange);
        const categoryId = parseInt(categories);

        const book = await this.prisma.book.create({
            data: {
                title,
                summary,
                bookCover,
                isAudioBook,
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

    async getAllBookByAuthor(authorId: string) {
        const books = await this.prisma.book.findMany({
            where: {
                userId: parseInt(authorId, 10), 
            },
            include: {
                chapter: true,
            }
        });
    
        if (!books || books.length === 0) {
            throw new NotFoundException(`No books found for authorId ${authorId}`);
        }
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
    
        const books = await this.prisma.book.deleteMany({
            where: {
                id: parseInt(bookId, 10),
            },
        });
        return books;
    }

    async updateBook(decodedTitle: string, bookDto: UpdateBookDto, userId: number) {
        const {
            title,
            summary,
            bookCover,
            hashtags,
            categories,
            ageRange,
            bookCopyright,
            isAudioBook,
        } = bookDto;
    
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const book = await this.prisma.book.findUnique({
            where: { title: decodedTitle },
        });
    
        if (!book) {
            throw new NotFoundException("This book does not exist. Please enter the correct title.");
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException("You are not the author of this book. You cannot update book.");
        }
    
        let hashtagsData = {};
        if (hashtags && Array.isArray(hashtags)) {
            hashtagsData = {
                hashtags: {
                    deleteMany: {},
                    create: hashtags.map((tag: string) => ({
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
    
        let categoryData = {};
        if (categories && Array.isArray(categories)) {
            categoryData = {
                categories: {
                    create: categories.map((categoryId: number) => ({
                        category: { connect: { id: categoryId } },
                    })),
                },
            };
        }
    
        let ageRangeData = {};
        if (ageRange && Array.isArray(ageRange)) {
            ageRangeData = {
                ageRange: {
                    create: ageRange.map((rangeId: number) => ({
                        range: { connect: { id: rangeId } },
                    })),
                },
            };
        }
    
        let copyrightData = {};
        if (bookCopyright && Array.isArray(bookCopyright)) {
            copyrightData = {
                bookCopyright: {
                    create: bookCopyright.map((copyrightId: number) => ({
                        copyright: { connect: { id: copyrightId } },
                    })),
                },
            };
        }

        const updatedBook = await this.prisma.book.update({
            where: { id:book.id }, 
            data: {
                title,
                summary,
                bookCover,
                isAudioBook,
                ...hashtagsData,
                ...categoryData,
                ...ageRangeData,
                ...copyrightData,
            },
        });
        return updatedBook;
    }
}
