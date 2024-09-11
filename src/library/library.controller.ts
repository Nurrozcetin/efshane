import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('library')
export class LibraryController {
    constructor(private readonly libraryService: LibraryService) {}

    @UseGuards(JwtAuthGuard)
    @Post('add/:bookId')
    async addBookToLibrary(
    @Param('bookId') bookId: string,
    @Body() body: { isAudioBook: boolean }, 
    @Req() req 
    ) {
        const userId = req.user.id; 
        const { isAudioBook } = body;

        return this.libraryService.addBookToLibrary(bookId, userId, isAudioBook);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async showLibrary(
        @Req() req
    ) {
        const userID = req.user.id;
        return this.libraryService.showLibrary(userID);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:bookId')
    async removeBookFromLibrary(
        @Param('bookId') bookId: string,
        @Body() body: { isAudioBook: boolean }, 
        @Req() req
    ) {
        const bookID = parseInt(bookId, 10)
        const userID = req.user.id;
        const { isAudioBook } = body;
        return this.libraryService.removeBookFromLibrary(bookID, userID, isAudioBook );
    }

}
