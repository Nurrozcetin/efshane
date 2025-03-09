import { hash } from 'bcryptjs';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { UpdateAudioBookDto } from './dto/update-audiobook.dto';
import { NotificationsGateway } from 'src/notification/notification.gateway';

@Injectable()
export class AudioBookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationGateway: NotificationsGateway,
    ) {}
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

    async getAudioBookForHome(decodedTitle: string, userId: number) {
        try {
            if (!decodedTitle) {
                throw new BadRequestException("Title parameter is required.");
            }

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
                },
                select: {
                    id: true,
                    title: true,
                    bookCover: true,
                    duration: true,
                    summary: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profile_image: true,
                        },
                    },
                    audioBookCase: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                },
                            }
                        }
                    },
                    readingList: {
                        select: {
                            readingList: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    analysis: {
                        select: {
                            like_count: true,
                            read_count: true,
                            comment_count: true,
                        },
                    },
                    ageRange: {
                        select: {
                            range: true,
                        },
                    },
                    bookCopyright: {
                        select: {
                            copyright: true,
                        },
                    },
                    category: {
                        select: {
                            category: {
                                select: {
                                    name: true,
                                },
                            },
                        },
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
                    },
                    comments: {
                        select: {
                            content: true,
                            publish_date: true,
                            user: {
                                select: {
                                    profile_image: true,
                                    username: true,
                                }
                            }
                        }
                    }
                },
            });  

            return audioBooks.map((book) => {
                const isInListeningList = book.readingList.some(listening => listening.readingList.user.id === userId);
                const isAudioBookCase = book.audioBookCase.some(bookCase => bookCase.user.id === userId);
    
                return {
                    ...book,
                    isListeningList: isInListeningList, 
                    isAudioBookCase: isAudioBookCase,
                    ageRange: book.ageRange?.map((range) => range.range?.range) || [],
                    bookCopyright: book.bookCopyright?.map((copyright) => copyright.copyright?.copyright) || [], 
                    categories: book.category?.map((category) => category.category?.name) || [], 
                    hashtags: book.hashtags?.map((hashtag) => ({
                        id: hashtag.hashtag?.id,
                        name: hashtag.hashtag?.name,
                    })) || [],
                };      
            });
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
                bookCover: audioBookDto.bookCover || null,
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
        const formattedBooks = audioBooks.map((book) => ({
            ...book,
            read_count: book.analysis[0]?.read_count || 0,
            comment_count: book.analysis[0]?.comment_count || 0,
            like_count: book.analysis[0]?.like_count || 0,
        }));

        return formattedBooks;
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
                postId: null,
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

    async togglePublishWithNotifications(decodedTitle: string, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                profile_image: true,
            }
        });
        const updatedBook = await this.togglePublish(decodedTitle, userId);
    
        if (updatedBook.publish) {
            const followers = await this.prisma.following.findMany({
                where: { followersId: userId },
                select: { followingId: true },
            });
    
            for (const follower of followers) {
                const notificationData = {
                    message: `${updatedBook.title}`,
                    bookTitle: updatedBook.title,
                    bookId: updatedBook.id, 
                    authorUsername: user.username, 
                    authorProfileImage: user.profile_image,
                    isAudioBook: true,
                };
    
                this.notificationGateway.sendNotificationToUser(follower.followingId, notificationData);
    
                await this.prisma.notification.create({
                    data: {
                        userId: follower.followingId, 
                        authorId: userId, 
                        bookTitle: updatedBook.title,  
                        isAudioBook: true,     
                    },
                });
            }
        }
    
        return updatedBook;
    }

    async toggleLikeAudioBook(decodedTitle: string, userId: number) {
        try {
            if (!decodedTitle) {
                throw new BadRequestException("Title parameter is required.");
            }
    
            const normalizeTitle = (title: string) => {
                return title
                    .toLowerCase()
                    .normalize('NFC')
                    .replace(/[\u0300-\u036f]/g, '')
                    .trim()
                    .replace(/\s+/g, ' ');
            };
    
            const decodedNormalizedTitle = normalizeTitle(decodedTitle);
    
            const audioBooks = await this.prisma.audioBook.findMany({
                where: {
                    OR: [
                        { normalizedTitle: decodedNormalizedTitle },
                        { title: decodedTitle },
                    ],
                },
                include: {
                    user: true,
                },
            });
    
            if (!audioBooks || audioBooks.length === 0) {
                throw new NotFoundException("This audio book does not exist or does not belong to the provided username.");
            }

            const existingLike = await this.prisma.like.findFirst({
                where: { userId, audioBookId: audioBooks[0].id },
            });

            let like_count_change = 0;
            let isLiked: boolean;

            if (existingLike) {
                await this.prisma.like.delete({
                    where: { id: existingLike.id },
                });
        
                like_count_change = -1; 
                isLiked = false;
            } else {
                await this.prisma.like.create({
                    data: {
                        userId,
                        audioBookId: audioBooks[0].id,
                    },
                });
        
                like_count_change = 1;
                isLiked = true;
            }

            let analysis = await this.prisma.analysis.findFirst({
                where: { audioBookId:  audioBooks[0].id },
            });
        
            if (!analysis) {
                analysis = await this.prisma.analysis.create({
                    data: {
                        like_count: 0,
                        comment_count: 0,
                        read_count: 0,
                        repost_count: 0,
                        comment: {
                            connect: { id: audioBooks[0].id },
                        },
                    },
                });
            }
    
            const updatedAnalysis = await this.prisma.analysis.update({
                where: { id: analysis.id },
                data: {
                    like_count: { increment: like_count_change },
                },
            });
        
            return {
                message: isLiked ? 'Kitap beğenildi.' : 'Beğeni kaldırıldı.',
                like_count: updatedAnalysis.like_count,
                isLiked,
            };

        } catch (error) {
            console.error('Kitap detayları alınamadı:', error);
            throw error; 
        }
    }
}
