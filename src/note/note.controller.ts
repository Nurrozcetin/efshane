import { Controller, Get, Param } from "@nestjs/common";
import { NotesServices } from "./note.service";

@Controller('notes')
export class NotesController{
    constructor(
        private readonly notesService: NotesServices,
    ){}

    @Get(':bookId')
    async getNotesByBookId(@Param('bookId')  bookId: number){
        return this.notesService.getAllNotesByBookId(String(bookId));
    }

}