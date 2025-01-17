import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { BookCaseService } from './bookCase.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('book-case')
export class BookCaseController {
    constructor(private readonly bookCaseService: BookCaseService) {}

    @UseGuards(JwtAuthGuard)
    @Post('book/:bookTitle')
    async addBookBookCase(
        @Param('bookTitle') bookTitle: string,
        @Req() req 
    ) {
        const userId = req.user.id; 
        const decodedBookTitle = decodeURIComponent(bookTitle);
        return this.bookCaseService.addBookBookCase(decodedBookTitle, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('audioBook/:audioBookTitle')
    async addAudioBookBookCase(
        @Param('audioBookTitle') audioBookTitle: string,
        @Req() req 
    ) {
        const userId = req.user.id; 
        const decodedAudioBookTitle = decodeURIComponent(audioBookTitle);
        return this.bookCaseService.addAudioBookBookCase(decodedAudioBookTitle, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('last')
    async getLastReadBook(
        @Req() req
    ) {
        const userId = req.user.id; 
        const lastReadBook = await this.bookCaseService.getLastReadBook(userId);
        return lastReadBook;
    }    
}
