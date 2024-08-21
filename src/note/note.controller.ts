import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { NotesServices } from "./note.service";
import { CreatePrivateNoteDto } from "./dto/create-note.dto";

@Controller('notes')
export class NotesController{
    constructor(
        private readonly notesService: NotesServices,
    ){}

    @Post()
    async createPrivateNotes(@Body() body: CreatePrivateNoteDto) {
        return this.notesService.createPrivateNotes(body);
    }

    @Get(':bookId')
    async getNotesByBookId(@Param('bookId')  bookId: number){
        return this.notesService.getAllNotesByBookId(String(bookId));
    }

}