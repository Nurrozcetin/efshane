import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { LibraryService } from "src/library/library.service";

@Injectable()
export class AudioBookService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly libraryService: LibraryService) {}
    async createAudioBook(
        audioBookDto: CreateAudioBookDto,
        userId: number,
    ) {
        const { title, bookCover, duration, bookId} = audioBookDto;

        const audioBook = await this.prisma.audioBook.create({
            data: {
                title,
                bookCover,
                userId,
                bookId: bookId || null,
                duration,
                publish_date: new Date(),
            },
        });
        await this.libraryService.addBookToLibrary(audioBook.id.toString(), userId, true);
        return audioBook;
    } 

    async getAllAudioBook(authorId: string) {
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                userId: parseInt(authorId, 10), 
            },
            include: {
                episodes: true,
            }
        });
    
        if (!audioBooks || audioBooks.length === 0) {
            throw new NotFoundException(`No audio books found for authorId ${authorId}`);
        }
        return audioBooks;
    }

    async deleteAudioBook(audioBookId: string, userId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        if (audioBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot delete episodes.');
        }
    
        const audioBooks = await this.prisma.audioBook.deleteMany({
            where: {
                id: parseInt(audioBookId, 10),
            },
        });
        return audioBooks;
    }

    async updateAudioBook(audioBookId: string, updateData: any, userId: number){
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audioBookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        if (audioBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot update audio book.');
        }

        const audioBooks = await this.prisma.audioBook.updateMany({
            where: {
                id: parseInt(audioBookId, 10),
            },
            data: updateData,
        });
        return audioBooks;
    }
    
}
