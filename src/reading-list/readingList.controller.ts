import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ReadingListService } from './readingList.service';

@Controller('reading-list')
export class ReadingListController {
    constructor(private readonly readingListService: ReadingListService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':bookId')
    async addBookToreadingList(
        @Param('bookId') bookId: string,
        @Body('name') name: string,
        @Req() req 
    ) {
        const userId = req.user.id; 
        return this.readingListService.addBookToReadingList(bookId, userId, name);
    }

    @UseGuards(JwtAuthGuard)
    @Post('audioBook/:audioBookId')
    async addBookToListeningList(
        @Param('audioBookId') audioBookId: string,
        @Body('name') name: string,
        @Req() req 
    ) {
        const userId = req.user.id; 
        return this.readingListService.addBookToListeningList(audioBookId, userId, name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getLastReadBook(
        @Req() req 
    ) {
        const userId = req.user.id; 
        return this.readingListService.getLastReadBook(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getReadingList(@Req() req) {
        const userId = req.user.id;
        return this.readingListService.getReadingList(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list/:listName')
    async getBooksInList(
        @Req() req, 
        @Param('listName') listName: string
    ) {
        const userId = req.user.id;
        return this.readingListService.getBooksInList(userId, listName);
    }
}
