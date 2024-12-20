import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService{
    constructor(private readonly prisma: PrismaService) {}
    async createChapter(
        decodedTitle: string,
        chapterDto: CreateChapterDto,
        userId: number,
    ) {
        const {title, content, image } = chapterDto;
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
            throw new NotFoundException('This book not exist. Please enter the correct book title.');
        }

        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }

        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title,
                bookId: userBook.id,
            },
        });
    
        if (existingChapter) {
            throw new ConflictException('A chapter with the same title already exists for this book.');
        }

        const processedImage = image && image.trim() !== "" ? image : null;
        
        const decodedChapterNormalizedTitle = normalizeTitle(title);

        const chapter = await this.prisma.chapter.create({
            data: {
                title,
                normalizedTitle: decodedChapterNormalizedTitle,
                content,
                bookId: userBook.id,
                userId,
                publish: false,
                image: processedImage,
                date: new Date(),
            },
        });
        return chapter;
    }

    async publishCreateChapter(
        decodedTitle: string,
        chapterDto: CreateChapterDto,
        userId: number,
    ) {
        const { title, content, image } = chapterDto;

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

        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }

        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title,
                bookId: userBook.id,
            },
        });
    
        if (existingChapter) {
            throw new ConflictException('A chapter with the same title already exists for this book.');
        }

        const decodedChapterNormalizedTitle = normalizeTitle(title);

        const chapter = await this.prisma.chapter.create({
        data: {
            title,
            normalizedTitle: decodedChapterNormalizedTitle,
            content,
            bookId: userBook.id,
            userId,
            image,
            publish: true,
            date: new Date(),
        },
        });
        return chapter;
    }

    async togglePublishChapter(
        decodedTitle: string,
        decodedChapterTitle: string,
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

        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        }
    
        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title: decodedChapterTitle,
                bookId: userBook.id,
            },
        });
    
        if (!existingChapter) {
            throw new NotFoundException('This chapter does not exist for the specified book.');
        }
    
        const updatedChapter = await this.prisma.chapter.update({
            where: {
                id: existingChapter.id,
            },
            data: {
                publish: !existingChapter.publish, 
            },
        });
    
        return updatedChapter;
    }    
    
    async getAllChaptersByBookTitle(authorId: number, decodedTitle: string) {
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
                userId: authorId,
            },
        });        

        const userBook = books.find(book => book.userId === authorId);
    
        if (!userBook) {
            throw new NotFoundException("This book does not exist. Please enter the correct title.");
        }

        if(userBook.userId !== authorId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        } 

        const chapters = await this.prisma.chapter.findMany({
            where: {
                userId: authorId,
                bookId: userBook.id,
            },
            include: {
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        read_count: true
                    }
                }
            }
        });
    
        if (!chapters || chapters.length === 0) {
            throw new NotFoundException(`No chapters found for the book titled "${decodedTitle}".`);
        }
        return chapters;
    }
    
    async deleteChapter(
        decodedTitle: string,
        decodedChapterTitle: string,
        userId: number
    ) {
        const book = await this.prisma.book.findUnique({
            where: { title: decodedTitle },
        });
    
        if (!book) {
            throw new NotFoundException('This book does not exist.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not authorized to delete chapters from this book.');
        }
    
        const existingChapter = await this.prisma.chapter.findFirst({
            where: {
                title: decodedChapterTitle,
                bookId: book.id,
            },
        });
    
        if (!existingChapter) {
            throw new NotFoundException('This chapter does not exist.');
        }
    
        await this.prisma.chapter.delete({
            where: { id: existingChapter.id },
        });
    
        return { message: 'Chapter deleted successfully.' };
    }
    
    async getChapter(
        decodedTitle: string,
        decodedChapterTitle: string,
        userId: number
    ){
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
        const decodedChapterNormalizedTitle = normalizeTitle(decodedChapterTitle);
        
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
    
        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
        } 

        const chapter = await this.prisma.chapter.findFirst({
            where: {
                OR: [
                    {title: decodedChapterTitle},
                    {normalizedTitle: decodedChapterNormalizedTitle},
                ],
                bookId: userBook.id,
            },
            select: {
                title: true,
                image: true,
                content: true,
            },
        });
    
        if (!chapter) {
            throw new NotFoundException("This chapter does not exist. Please check the title.");
        }
    
        return chapter;
    }

    async saveUpdateChapter( 
        decodedTitle: string,
        decodedChapterTitle: string,
        chapterDto: UpdateChapterDto,
        userId: number
    ) {
            const { title, image, content } = chapterDto;
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
            const decodedChapterNormalizedTitle = normalizeTitle(decodedChapterTitle);

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
    
            if(userBook.userId !== userId) {
                throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
            }
        
            const chapter = await this.prisma.chapter.findFirst({
                where: {
                    OR: [
                        {title: decodedChapterTitle},
                        {normalizedTitle: decodedChapterNormalizedTitle},
                    ],
                    bookId: userBook.id,
                }
            });
        
            if (!chapter) {
                console.error("Chapter not found:", {
                    title: decodedChapterTitle,
                    normalizedTitle: decodedChapterNormalizedTitle,
                    bookId: userBook.id,
                });
                throw new NotFoundException("This chapter does not exist for the specified book.");
            }            
            
            const processedImage = image && image.trim() !== "" ? image : null;

            const updatedChapter = await this.prisma.chapter.update({
                where: { id: chapter.id },
                data: {
                    title,
                    image: processedImage,
                    content,
                    normalizedTitle: normalizeTitle(title),
                },
            });

            return updatedChapter;
        }

    async publishUpdateChapter( 
        decodedTitle: string,
        decodedChapterTitle: string,
        chapterDto: UpdateChapterDto,
        userId: number
    ) {
        const { title, image, content } = chapterDto;
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
            const decodedChapterNormalizedTitle = normalizeTitle(decodedChapterTitle);
    
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
        
            if(userBook.userId !== userId) {
                throw new ForbiddenException('You are not the author of this book. You cannot add chapters.')
            }
            
            const chapter = await this.prisma.chapter.findFirst({
                where: {
                    OR: [
                        {title: decodedChapterTitle},
                        {normalizedTitle: decodedChapterNormalizedTitle},
                    ],
                    bookId: userBook.id,
                }
            });
            
            if (!chapter) {
                console.error("Chapter not found:", {
                    title: decodedChapterTitle,
                    normalizedTitle: decodedChapterNormalizedTitle,
                    bookId: userBook.id,
                });
                throw new NotFoundException("This chapter does not exist for the specified book.");
            }            
            
            const processedImage = image && image.trim() !== "" ? image : null;

            const updatedChapter = await this.prisma.chapter.update({
                where: { id: chapter.id },
                data: {
                    title,
                    image: processedImage,
                    content,
                    normalizedTitle: normalizeTitle(title),
                    publish: true,
                },
            });
            return updatedChapter;
        }
}