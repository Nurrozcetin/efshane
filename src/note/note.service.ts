import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePrivateNoteDto } from './dto/create-note.dto';

@Injectable()
export class PrivateNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async createPrivateNote(
    createPrivateNoteDto: CreatePrivateNoteDto,
    userId: number,
  ) {
    const { content, bookId } = createPrivateNoteDto;
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const privateNote = await this.prisma.privateNotes.create({
      data: {
        content,
        userId,
        bookId,
        date: new Date(),
      },
    });
    return privateNote;
  }
    async getAllNotesByBookId(userId: string, bookId: string){
        const notes = await this.prisma.privateNotes.findMany({
            where:{
                userId: parseInt(userId, 10),
                bookId: parseInt(bookId, 10),
            },
        });

        if (!notes || (notes).length === 0) {
            throw new NotFoundException(`No notes found for bookId ${bookId}`);
        }
        return notes;
    }

    async deleteAllNotesByBookId(bookId: string, notesId: string){
        const notes = await this.prisma.privateNotes.deleteMany({
            where: {
                id: parseInt(notesId, 10),
                bookId: parseInt(bookId, 10),
            },
        });
        return notes;
    }

    async updateAllNotesByBookId(bookId: string, notesId: string, updateData: any){
        const notes = await this.prisma.privateNotes.updateMany({
            where: {
                id: parseInt(notesId, 10),
                bookId: parseInt(bookId, 10),
            },
            data: updateData,
        });
        return notes;
    }
}

