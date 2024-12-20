import { hash } from 'bcryptjs';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { LibraryService } from "src/library/library.service";
import { UpdateAudioBookDto } from './dto/update-audiobook.dto';
import { UpdateChapterDto } from "src/chapter/dto/update-chapter.dto";
import { UpdateEpisodeDto } from "src/episode/dto/update-episode.dto";
import { use } from 'passport';

@Injectable()
export class AudioBookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly libraryService: LibraryService) {}
    async createAudioBook(
        audioBookDto: CreateAudioBookDto,
        userId: number,
    ) {
        const { title, summary, duration, bookCover, hashtags, normalizedTitle, categories, ageRange, bookCopyright, bookId} = audioBookDto;

        const existingAudioBookTitle = await this.prisma.audioBook.findUnique({
            where: {
                title,
            },
        });

        if (existingAudioBookTitle) {
            throw new Error('A audio book with this title already exists. Please choose a different title.');
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
        const audioBookk = await this.prisma.audioBook.create({
            data: {
                title,
                summary,
                duration,
                bookCover,
                normalizedTitle: decodedNormalizedTitle,
                userId,
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
                category: {
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

        await this.libraryService.addBookToLibrary(audioBookk.id.toString(), userId, true);
        return audioBookk;
    } 

    async getAudioBookByTitle(decodedTitle: string, userId: number) {
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
        
            const audioBooks = await this.prisma.audioBook.findMany({
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
                    category: {
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
    
            const userAudioBook = audioBooks.find(audioBook => audioBook.userId === userId);
        
            if (!userAudioBook) {
                throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
            }
            return userAudioBook;
        } catch (error) {
            console.error('Sesli kitap alınamadı:', error);
            throw error; 
        }
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

    async updateAudioBook(decodedTitle: string, audioBookDto: UpdateAudioBookDto, userId: number) {
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
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedNormalizedTitle },
                ],
                userId: userId,
            },
        });        

        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }
    
        let hashtagsData = {};
        if (audioBookDto.hashtags && Array.isArray(audioBookDto.hashtags)) {
            hashtagsData = {
                hashtags: {
                    deleteMany: {},
                    create: audioBookDto.hashtags.map((tag: string) => ({
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
        if (audioBookDto.ageRange && typeof audioBookDto.ageRange === 'string') {
            ageRangeData = {
                ageRange: {
                    deleteMany: {},
                    create: [
                        {
                            range: { connect: { id: parseInt(audioBookDto.ageRange) } },
                        },
                    ],
                },
            };
        }

        let categoryData = {};
        if (audioBookDto.categories && typeof audioBookDto.categories === 'string') {
            categoryData = {
                category: {
                    deleteMany: {},
                    create: [
                        {
                            category: { connect: { id: parseInt(audioBookDto.categories) } },
                        },
                    ],
                },
            };
        }

        let copyrightData = {};
        if (audioBookDto.bookCopyright && typeof audioBookDto.bookCopyright === 'string') {
            copyrightData = {
                bookCopyright: {
                    deleteMany: {},
                    create: [
                        {
                            copyright: { connect: { id: parseInt(audioBookDto.bookCopyright) } },
                        },
                    ],
                },
            };
        }

        if(audioBookDto.title && audioBookDto.title !== audioBookDto.title) {
            const existingNewBook = await this.prisma.audioBook.findUnique({
                where: { title: audioBookDto.title },
            });
            if (existingNewBook) {
                throw new ConflictException('Bu başlık zaten mevcut.');
            }
        }

        const updatedAudioBook = await this.prisma.audioBook.update({
            where: { id:userBook.id }, 
            data: {
                title: audioBookDto.title,
                summary: audioBookDto.summary,
                normalizedTitle: normalizeTitle(audioBookDto.title),
                bookCover: audioBookDto.bookCover,
                ...hashtagsData,
                ...categoryData,
                ...ageRangeData,
                ...copyrightData,
            },
            include: {
                ageRange: true,
                bookCopyright: true,
                category: true,
                hashtags: {
                    select: {
                        hashtag: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        return updatedAudioBook;
    }

    async getAudioBooksByAuthorId(authorId: number) {
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                userId: authorId,
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                publish_date: true,
                duration: true,
                publish: true,
                analysis: {
                    select: {
                        read_count: true,
                        comment_count: true,
                        like_count: true,
                    },
                },
            },
        });
        return audioBooks;
    }

    async deleteBook(bookId: string, userId: number) {
        const book = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(bookId, 10) },
        });
    
        if (!book) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        if (book.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot delete episodes.');
        }
        await this.prisma.audioBook.delete({
            where: { id: parseInt(bookId, 10) },
        });
    
        return { message: 'Audio book deleted successfully.' };
    }

    async convertAudioBook(decodedTitle: string, authorId: number) {
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

        const book = await this.prisma.book.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedNormalizedTitle },
                ],
                userId: authorId,
            },
            include: {
                hashtags: true,
                categories: true,
                analysis: true,
                ageRange: true,
                bookCopyright: true,
            },
        });
    
        const userBook = book.find(book => book.userId === authorId);

        if (!userBook) {
            throw new Error(`Book with title '${decodedNormalizedTitle}' not found`);
        }
    
        const updatedBook = await this.prisma.book.update({
            where: { id: userBook.id },
            data: {
                isAudioBook: true,
            },
        });
    
        const audioBook = await this.prisma.audioBook.create({
            data: {
                title: updatedBook.title,
                summary: updatedBook.summary,
                bookCover: updatedBook.bookCover,
                publish: updatedBook.publish,
                publish_date: updatedBook.publish_date,
                bookId: updatedBook.id,
                userId: updatedBook.userId,
                normalizedTitle: updatedBook.normalizedTitle,
                duration: "0.00",
            },
        });

        await this.prisma.analysis.createMany({
            data: userBook.analysis.map((analysis) => ({
                like_count: analysis.like_count,
                comment_count: analysis.comment_count,
                read_count: analysis.read_count,
                repost_count: null,
            }))
        })

        await this.prisma.audioBookHashtags.createMany({
            data: userBook.hashtags.map((tag) => ({
                audioBookId: audioBook.id,
                hashtagsId: tag.hashtagsId,
            })),
        });
    
        await this.prisma.audioBookAgeRange.createMany({
            data: userBook.ageRange.map((range) => ({
                audioBookId: audioBook.id,
                rangeId: range.rangeId,
            })),
        });
    
        await this.prisma.audioBookCategory.createMany({
            data: userBook.categories.map((cat) => ({
                audioBookId: audioBook.id,
                categoryId: cat.categoryId,
            })),
        });

        await this.prisma.audioBookCopyright.createMany({
            data: userBook.bookCopyright.map((copyright) => ({
                audioBookId: audioBook.id,
                bookCopyrightId: copyright.bookCopyrightId,
            })),
        });
    
        console.log("AudioBook:", audioBook);
        return audioBook;
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

        const updatedBook = await this.prisma.audioBook.update({
            where: {
                id: userBook.id,
            },
            data: {
                publish: !userBook.publish, 
            },
        });
    
        return updatedBook;
    }  
}
