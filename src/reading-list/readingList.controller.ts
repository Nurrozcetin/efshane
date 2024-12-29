import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ReadingListService } from './readingList.service';

@Controller('reading-list')
export class ReadingListController {
    constructor(private readonly readingListService: ReadingListService) {}

    @UseGuards(JwtAuthGuard)
    @Post('add/:bookId')
    async addBookToreadingList(
    @Param('bookId') bookId: string,
    @Req() req 
    ) {
        const userId = req.user.id; 
        return this.readingListService.addBookToReadingList(bookId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async showReadingList(
        @Req() req
    ) {
        const userID = req.user.id;
        return this.readingListService.showReadingList(userID);
    }

    @Get('user/:username')
    async showUserReadingList(
        @Param('username') username: string,
    ) {
        return this.readingListService.showUserReadingList(username);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:bookId')
    async removeBookFromreadingList(
        @Param('bookId') bookId: string,
        @Body() body: { isAudioBook: boolean }, 
        @Req() req
    ) {
        const bookID = parseInt(bookId, 10)
        const userID = req.user.id;
        const { isAudioBook } = body;
        return this.readingListService.removeBookFromreadingList(bookID, userID, isAudioBook );
    }

}
