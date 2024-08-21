import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreatePrivateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesServices {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    async createPrivateNotes(createPrivateNoteDto:CreatePrivateNoteDto) {
        const {content, bookId} = createPrivateNoteDto;
        return this.prisma.privateNotes.create({
            data: {
                content, 
                bookId
            }
        });
    }

    async getAllNotesByBookId(bookId: string){
        const notes = await this.prisma.privateNotes.findMany({
            where:{
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