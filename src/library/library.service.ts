import { User } from '@prisma/client';
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class LibraryService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addBookToLibrary(bookId: string, userId: number, isAudioBook: boolean) {
        let book;

        if (isAudioBook) {
            book = await this.prisma.audioBook.findUnique({
                where: { id: parseInt(bookId, 10) },
            });
        } else {
            book = await this.prisma.book.findUnique({
                where: { id: parseInt(bookId, 10) },
            });
        }

        if (!book) {
            throw new NotFoundException('This book does not exist.');
        }

        if (book.userId !== userId) {
            throw new UnauthorizedException('You can only add your own books to the library.');
        }

        let library = await this.prisma.library.findFirst({
            where: { userId: userId },
            include: { books: true, audioBooks: true },
        });

        if (!library) {
            library = await this.prisma.library.create({
                data: {
                    userId: userId,
                    books: { connect: [] },        
                    audioBooks: { connect: [] },  
                },
                include: { books: true, audioBooks: true },
            });
        }

        if (isAudioBook) {
            await this.prisma.library.update({
                where: { id: library.id },
                data: {
                    audioBooks: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        } else {
            await this.prisma.library.update({
                where: { id: library.id },
                data: {
                    books: {
                        connect: {
                            id: book.id,
                        },
                    },
                },
            });
        }
        
        return library;
    }

    async showLibrary(userId: number) {
        const library = this.prisma.library.findUnique({
            where: {
                userId: userId
            },
            include: { books: true, audioBooks: true },
        });

        if (!library) {
            throw new NotFoundException('Library not found for this user.');
        }
        return library;
    }

    async removeBookFromLibrary(bookId: number, userId: number, isAudioBook: boolean) {
        const library =  await this.prisma.library.findUnique({
            where:{
                userId: userId
            },
            include: {
                books: true,
                audioBooks: true
            },
        });

        if(!library) {
            throw new NotFoundException('Library not found');
        }

        if(isAudioBook) {
            const audioBookExists =  library.audioBooks.some((audioBook) => audioBook.id === bookId);
            
            if(!audioBookExists) {
                throw new NotFoundException('This audiobook does not exist in the library');
            }

            await this.prisma.library.update({
                where: {
                    userId: userId
                },
                data:{
                    audioBooks: {
                        disconnect:{
                            id: bookId
                        },
                    }
                }
            });
        }
        else {
            const  bookExists = library.books.some((book) => book.id === bookId);
            if(!bookExists) {
                throw new NotFoundException('This book does not exist in the library');
            }

            await this.prisma.library.update({
                where:{
                    userId: userId
                }, 
                data: {
                    books: {
                        disconnect: {
                            id: bookId
                        }
                    }
                }
            });
        }
        return { message: 'Book successfully removed from the library.' };
    }
}