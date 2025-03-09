import { ReadingList } from './../../node_modules/.prisma/client/index.d';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { read } from 'fs';
import { PrismaService } from "prisma/prisma.service";
@Injectable()
export class ReadingListService {
    constructor(
        private readonly prisma: PrismaService
    ) {}
    //addtolisteninglist vardi usttekiyle birlestir

    async getReadingList(userId: number) {
        const lists = await this.prisma.readingList.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                image: true,
                bookReadingList: {
                    select: {
                        book: {
                            select: {
                                title: true,
                                bookCover: true,
                            },
                        },
                        audioBook: {
                            select: {
                                title: true,
                                bookCover: true, 
                            },
                        },
                    },
                },
            },
        });
    
        return lists.map((list) => ({
            id: list.id,
            name: list.name,
            image: list.image,
            books: list.bookReadingList.map(item => {
                if (item.book) {
                    return {
                        title: item.book.title,
                        bookCover: item.book.bookCover,
                        type: "book" 
                    };
                } else if (item.audioBook) {
                    return {
                        title: item.audioBook.title,
                        bookCover: item.audioBook.bookCover,
                        type: "audiobook" 
                    };
                }
            }).filter(Boolean) 
        }));
    }

    async getBooksInList(userId: number, decodedTitle: string) {    
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase()
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '')
                .trim()
                .replace(/\s+/g, ' ');
        };

        const decodedNormalizedTitle = normalizeTitle(decodedTitle);

        const list = await this.prisma.readingList.findFirst({
            where: {
                OR: [
                    { userId: userId, normalizedTitle: decodedNormalizedTitle },
                    { name: decodedTitle },
                ],
            },
            include: {
                bookReadingList: {
                    select: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                bookCover: true,
                            },
                        },
                        audioBook: {
                            select: {
                                id: true,
                                title: true,
                                bookCover: true,
                            },
                        },
                    },
                },
            },
        });
    
        if (!list) {
            console.log("Backend: No list found");
            return null;
        }
        
        return {
            id: list.id,
            name: list.name,
            image: list.image || '/images/default-readinglist-cover.webp',
            books: list.bookReadingList
                .map(item => {
                    if (item.book) {
                        return {
                            id: item.book.id,   
                            title: item.book.title,
                            bookCover: item.book.bookCover,
                            type: "book" 
                        };
                    } else if (item.audioBook) {
                        return {
                            id: item.audioBook.id,  
                            title: item.audioBook.title,
                            bookCover: item.audioBook.bookCover,
                            type: "audiobook" 
                        };
                    }
                    return null;
                })
                .filter(Boolean), 
            rawBookData: list.bookReadingList 
        };
    } 

    async removeList(userId: number, listId: string) {
        const listID = parseInt(listId);

        const list = await this.prisma.readingList.delete({
            where: { userId, id: listID },
            select: { id: true },
        });
    
        if (!list) {
            throw new Error("Okuma listesi bulunamadı.");
        }

        console.log("Backend: List", list);
        return { message: "Sesli kitap başarıyla listeden kaldırıldı.", list };
    }

    async removeBookFromList(userId: number, decodedTitle: string, bookId?: string, audioBookId?: string) {
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
        const audioBookID = parseInt(audioBookId);
        const bookID = parseInt(bookId);

        const list = await this.prisma.readingList.findFirst({
            where: { 
                OR: [
                    { userId: userId, normalizedTitle: decodedNormalizedTitle },
                    { name: decodedTitle },
                ],
            },
            select: { id: true },
        });
    
        if (!list) {
            throw new Error("Okuma listesi bulunamadı.");
        }
    
        if (bookId) {
            const deletedBook = await this.prisma.bookReadingList.delete({
                where: {
                    readingListId_bookId: {
                        readingListId: list.id,
                        bookId: bookID,
                    },
                },
            });
    
            return { message: "Kitap başarıyla listeden kaldırıldı.", deletedBook };
        }

        if (audioBookId) {
            const deletedAudioBook = await this.prisma.bookReadingList.delete({
                where: {
                    readingListId_audioBookId: {
                        readingListId: list.id,
                        audioBookId: audioBookID,
                    },
                },
            });
    
            return { message: "Sesli kitap başarıyla listeden kaldırıldı.", deletedAudioBook };
        }

        throw new Error("Geçerli bir kitap veya sesli kitap ID'si sağlanmadı.");    
    }

    async updateListName(userId: number, decodedOldListName: string, decodedNewName: string) {
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
        const decodedNormalizedTitle = normalizeTitle(decodedOldListName);

        const existingList = await this.prisma.readingList.findFirst({
            where: { 
                OR: [
                    { userId: userId, normalizedTitle: decodedNormalizedTitle },
                    { name: decodedOldListName },
                ],
            },
            select: { id: true },
        });
    
        if (!existingList) {
            throw new Error("Okuma listesi bulunamadı.");
        }

        const updatedList = await this.prisma.readingList.update({
            where: { id: existingList.id },
            data: { name: decodedNewName, normalizedTitle: normalizeTitle(decodedNewName) },
        });

        console.log("Backend: Updated list", updatedList);
        return {
            success: true,
            data: updatedList.name,
        };
    }

    async addBookToList(userId: number, listId: string, decodedTitle: string) {
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
        const listID = parseInt(listId);
        const readinglist = await this.prisma.readingList.findFirst({
            where: {
                userId: userId,
                id: listID,
            },
        })
        const bookID = await this.prisma.book.findFirst({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedNormalizedTitle },
                ],
            },
        });    
        const audioBookID = await this.prisma.audioBook.findFirst({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedNormalizedTitle },
                ],
            },
        });

        if(bookID){
            return await this.prisma.bookReadingList.create({
                data: {
                    readingList: { connect: { id: readinglist.id } },
                    book: { connect: { id: bookID.id } },
                }
            });
        }
        if(audioBookID){
            return await this.prisma.bookReadingList.create({
                data: {
                    readingList: { connect: { id: readinglist.id } },
                    audioBook: { connect: { id: audioBookID.id } },
                }
            });
        }
    }

    async createNewList(userId: number, decodedListTitle: string, decodedTitle: string) {
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
        const decodedNormalizedListTitle = normalizeTitle(decodedListTitle);
        const decodedNormalizedBookTitle = normalizeTitle(decodedTitle);

        const bookID = await this.prisma.book.findFirst({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedBookTitle },
                    { title: decodedTitle },
                ],
            },
        });    
        const audioBookID = await this.prisma.audioBook.findFirst({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedBookTitle },
                    { title: decodedTitle },
                ],
            },
        });

        const bookCover = bookID?.bookCover || audioBookID?.bookCover || null;

        const list = await this.prisma.readingList.create({
            data: {
                name: decodedListTitle,
                normalizedTitle: decodedNormalizedListTitle,
                user: { connect: { id: userId } },
                image: bookCover,
            },
        });

        const readinglistID = list.id;

        if(bookID){
            return await this.prisma.bookReadingList.create({
                data: {
                    readingList: { connect: { id: readinglistID } },
                    book: { connect: { id: bookID.id } },
                }
            });
        }

        if(audioBookID){
            return await this.prisma.bookReadingList.create({
                data: {
                    readingList: { connect: { id: readinglistID } },
                    audioBook: { connect: { id: audioBookID.id } },
                }
            });
        }
        console.log("Backend: Added book to list");
    }
}