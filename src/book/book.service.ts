import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { NotificationsGateway } from "src/notification/notification.gateway";
import { publish } from "rxjs";
@Injectable()
export class BookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationGateway: NotificationsGateway
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
                user: {
                    connect: { id: userID },
                },
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
        
        return book;
    }

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
                    },
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
                publish: true,
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
                },
                publish: true,
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
                publish: true,
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                    }
                },
                publish: true,
            }
        })
        return { books, users, audioBooks };
    }

    async getTrendsBook() {
        const books = await this.prisma.book.findMany({
            where: {
                publish: true,
            },
            select: {
                id: true,
                title: true,
                bookCover: true,
                isAudioBook: false, 
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                analysis: {
                    select: {
                        read_count: true,
                    },
                },
                publish: true,
            },
        });
    
        const audioBooks = await this.prisma.audioBook.findMany({
            select: {
                id: true,
                title: true,
                bookCover: true,
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                analysis: {
                    select: {
                        read_count: true,
                    },
                },
                publish: true,
            },
        });
    
        if ((!books || books.length === 0) && (!audioBooks || audioBooks.length === 0)) {
            throw new NotFoundException(`Trend kitap veya sesli kitap bulunamadı`);
        }

        const formattedBooks = books.flatMap((book) => ({
            id: book.id,
            title: book.title,
            bookCover: book.bookCover,
            isAudioBook: false, 
            username: book.user.username,
            profile_image: book.user?.profile_image,
            analysis: book.analysis,
            publish: book.publish,
        }));
    
        const formattedAudioBooks = audioBooks.flatMap((audioBook) => ({
            id: audioBook.id,
            title: audioBook.title,
            bookCover: audioBook.bookCover,
            username: audioBook.user.username,
            isAudioBook: true,
            profile_image: audioBook.user?.profile_image,
            analysis: audioBook.analysis,
            publish: audioBook.publish,
        }));

        const allBooks = [...formattedBooks, ...formattedAudioBooks];
    
        allBooks.sort((a, b) => {
            const aReadCount = 'analysis' in a ? a.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0) : 0;
            const bReadCount = 'analysis' in b ? b.analysis.reduce((sum, item) => sum + (item.read_count || 0), 0) : 0;
            return bReadCount - aReadCount;
        });
    
        return allBooks;
    }    

    async getAllBook() {
        const currentYear = new Date().getFullYear();
        const books = await this.prisma.book.findMany({
            where: {
                publish: true,
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
                    },
                },
                publish: true,
            },
        });
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                publish: true, 
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
                    },
                },
                publish: true, 
            },
        });
    
        const formattedBooks = books.flatMap((book) => ({
            id: book.id,
            title: book.title,
            bookCover: book.bookCover,
            publish: book.publish,
            isAudioBook: false, 
            username: book.user.username,
            profile_image: book.user?.profile_image, 
        }));
    
        const formattedAudioBooks = audioBooks.flatMap((audioBook) => ({
            id: audioBook.id,
            title: audioBook.title,
            bookCover: audioBook.bookCover,
            username: audioBook.user.username,
            isAudioBook: true,
            publish: audioBook.publish,
            profile_image: audioBook.user?.profile_image,
        }));
        const allBooks = [...formattedBooks, ...formattedAudioBooks];
    
        if (!allBooks || allBooks.length === 0) {
            throw new NotFoundException(`Bu yıl yayınlanan kitap veya sesli kitap bulunamadı`);
        }
        return allBooks;
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
            read_count: book.analysis[0]?.read_count || 0,
            comment_count: book.analysis[0]?.comment_count || 0,
            like_count: book.analysis[0]?.like_count || 0,
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

    async togglePublishWithNotifications(decodedTitle: string, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                profile_image: true,
            }
        });
        const updatedBook = await this.togglePublish(decodedTitle, userId);
    
        if (!updatedBook.publish) {
            const chapters = await this.prisma.chapter.findMany({
                where: { bookId: updatedBook.id },
            });
    
            for (const chapter of chapters) {
                await this.prisma.chapter.update({
                    where: { id: chapter.id },
                    data: { publish: false },  
                });
            }
        }

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
                    authorProfileImage: user.profile_image || 'default-book-cover.jpg'
                };
    
                this.notificationGateway.sendNotificationToUser(follower.followingId, notificationData);
    
                await this.prisma.notification.create({
                    data: {
                        userId: follower.followingId, 
                        authorId: userId, 
                        bookTitle: updatedBook.title,       
                    },
                });
            }
        }
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

    async getBookDetailsByTitle(decodedTitle: string, userId: number) {
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
    
            const books = await this.prisma.book.findMany({
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
                    summary: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profile_image: true,
                        },
                    },
                    like: {
                        select:{
                            id: true,
                        }
                    },
                    bookCase: {
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
                            user: {
                                select: {
                                    id: true,
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
                            range: {
                                select: {
                                    range: true,
                                }
                            }
                        },
                    },
                    bookCopyright: {
                        select: {
                            copyright: {
                                select: {
                                    copyright: true,
                                },
                            },
                        },
                    },
                    categories: {
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
    
            if (!books || books.length === 0) {
                throw new NotFoundException("This book does not exist or does not belong to the provided username.");
            }

            return books.map((book) => {
                const isInReadingList = book.readingList.some(reading => reading.user.id === userId);
                const isInBookCase = book.bookCase.some(bookCase => bookCase.user.id === userId);
                const isLiked = book.like.some(like => like.id === userId);

                return {
                    ...book,
                    isReadingList: isInReadingList, 
                    isBookCase: isInBookCase,
                    isLiked: isLiked,
                    ageRange: book.ageRange.map((range) => range.range.range), 
                    bookCopyright: book.bookCopyright.map((copyright) => copyright.copyright.copyright), 
                    categories: book.categories.map((category) => category.category.name),
                    hashtags: book.hashtags.map((hashtag) => ({
                        id: hashtag.hashtag.id,
                        name: hashtag.hashtag.name,
                    })), 
                };
            });
        } catch (error) {
            console.error('Kitap detayları alınamadı:', error);
            throw error; 
        }
    }
    
    async toggleLikeBook(decodedTitle: string, userId: number) {
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
    
            const books = await this.prisma.book.findMany({
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
    
            if (!books || books.length === 0) {
                throw new NotFoundException("This book does not exist or does not belong to the provided username.");
            }

            const existingLike = await this.prisma.like.findFirst({
                where: { userId, bookId: books[0].id },
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
                        bookId: books[0].id,
                    },
                });
        
                like_count_change = 1;
                isLiked = true;
            }

            let analysis = await this.prisma.analysis.findFirst({
                where: { bookId:  books[0].id },
            });
        
            if (!analysis) {
                analysis = await this.prisma.analysis.create({
                    data: {
                        like_count: 0,
                        comment_count: 0,
                        read_count: 0,
                        repost_count: 0,
                        comment: {
                            connect: { id:  books[0].id },
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