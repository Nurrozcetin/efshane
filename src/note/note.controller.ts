import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards, Req } from "@nestjs/common";
import { CreatePrivateNoteDto } from "./dto/create-note.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { PrivateNotesService } from "./note.service";

@Controller('notes')
export class NotesController{
    constructor(
        private readonly notesService: PrivateNotesService,
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPrivateNotes(
    @Param('bookId') bookId: number, 
    @Body() body: CreatePrivateNoteDto,
    @Req() req) 
    {
        const userId = req.user.id; 
        return this.notesService.createPrivateNote(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/:bookId')
    async getNotesByBookId(
        @Param('userId') userId: number,
        @Param('bookId') bookId: number,
    ) {
        return this.notesService.getAllNotesByBookId(String(userId), String(bookId));
    }
        
    @UseGuards(JwtAuthGuard)
    @Delete(':bookId/:notesId')
    async deleteNotesByBookId(@Param('bookId')  bookId: number,
    @Param('notesId')  notesId: number,
    @Body() body: CreatePrivateNoteDto
    ){
        return this.notesService.deleteAllNotesByBookId(String(bookId), String(notesId));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookId/:notesId')
    async updateAllNotesByBookId(@Param('bookId')  bookId: number,
    @Param('notesId')  notesId: number,
    @Body() body: CreatePrivateNoteDto
    ){
        return this.notesService.updateAllNotesByBookId(String(bookId), String(notesId), body);
    }

}