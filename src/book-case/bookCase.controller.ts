import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { BookCaseService } from './bookCase.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('book-case')
export class BookCaseController {
    constructor(private readonly bookCaseService: BookCaseService) {}

    @UseGuards(JwtAuthGuard)
    @Post('add/:bookId')
    async addBookToBookCase(
    @Param('bookId') bookId: string,
    @Body() body: { isAudioBook: boolean }, 
    @Req() req 
    ) {
        const userId = req.user.id; 
        const { isAudioBook } = body;

        return this.bookCaseService.addBookToBookCase(bookId, userId, isAudioBook);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async showBookCase(
        @Req() req
    ) {
        const userID = req.user.id;
        return this.bookCaseService.showBookCase(userID);
    }

    @UseGuards(JwtAuthGuard)
    @Get('last')
    async getLastReadBook(@Req() req) {
        const userId = req.user.id; 
        const lastReadBook = await this.bookCaseService.getLastReadBook(userId);
        return lastReadBook;
    }    

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:bookId')
    async removeBookFromBookCase(
        @Param('bookId') bookId: string,
        @Body() body: { isAudioBook: boolean }, 
        @Req() req
    ) {
        const bookID = parseInt(bookId, 10)
        const userID = req.user.id;
        const { isAudioBook } = body;
        return this.bookCaseService.removeBookFromBookCase(bookID, userID, isAudioBook );
    }

}
