import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class NotesServices {
    constructor(
        private readonly prisma:PrismaService
    ) {}

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
}