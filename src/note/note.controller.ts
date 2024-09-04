import { Body, Controller, Get, Param, Post, Delete, Put } from "@nestjs/common";
import { NotesServices } from "./note.service";
import { CreatePrivateNoteDto } from "./dto/create-note.dto";

@Controller('notes')
export class NotesController{
    constructor(
        private readonly notesService: NotesServices,
    ){}

    /*@Post()
    async createPrivateNotes(@Body() body: CreatePrivateNoteDto) {
        return this.notesService.createPrivateNotes(body);
    }*/

    @Get(':userId/:bookId')
    async getNotesByBookId(
        @Param('userId') userId: number,
        @Param('bookId') bookId: number,
    ) {
        return this.notesService.getAllNotesByBookId(String(userId), String(bookId));
    }
        
    @Delete(':bookId/:notesId')
    async deleteNotesByBookId(@Param('bookId')  bookId: number,
    @Param('notesId')  notesId: number,
    @Body() body: CreatePrivateNoteDto
    ){
        return this.notesService.deleteAllNotesByBookId(String(bookId), String(notesId));
    }

    @Put(':bookId/:notesId')
    async updateAllNotesByBookId(@Param('bookId')  bookId: number,
    @Param('notesId')  notesId: number,
    @Body() body: CreatePrivateNoteDto
    ){
        return this.notesService.updateAllNotesByBookId(String(bookId), String(notesId), body);
    }

}