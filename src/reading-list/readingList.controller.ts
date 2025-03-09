import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete, Query, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ReadingListService } from './readingList.service';

@Controller('reading-list')
export class ReadingListController {
    constructor(private readonly readingListService: ReadingListService) {}

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
        const decodedTitle = decodeURIComponent(listName);
        return await this.readingListService.getBooksInList(userId, decodedTitle);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('list/:listId')
    async removeList(
        @Req() req, 
        @Param('listId') listId: string,
    ) {
        const userId = req.user.id;
        return await this.readingListService.removeList(userId, listId, );
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async removeBookFromList(
        @Req() req, 
        @Query('listName') listName: string,
        @Query('bookId') bookId: string,
        @Query('audioBookId') audioBookId: string
    ) {
        const userId = req.user.id;
        const decodedTitle = decodeURIComponent(listName);
        return await this.readingListService.removeBookFromList(userId, decodedTitle, bookId, audioBookId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':listName')
    async updateListName(
        @Req() req, 
        @Param('listName') listName: string,
        @Body('newListName') newListName: string,
    ) {
        const userId = req.user.id;
        const decodedOldListName = decodeURIComponent(listName);
        const decodedNewName = decodeURIComponent(newListName);
        console.log('decodedOldListName', decodedOldListName);
        console.log('decodedNewName', decodedNewName);
        return await this.readingListService.updateListName(userId, decodedOldListName, decodedNewName);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':listId')
    async addBookToList(
        @Req() req, 
        @Param('listId') listId: string,
        @Body('formattedBookName') formattedBookName: string,
    ) {
        const userId = req.user.id;
        const decodedTitle = decodeURIComponent(formattedBookName);
        return await this.readingListService.addBookToList(userId, listId, decodedTitle );
    }

    @UseGuards(JwtAuthGuard)
    @Post('list/:listName')
    async createNewList(
        @Req() req, 
        @Param('listName') listName: string,
        @Body('formattedBookName') formattedBookName: string,
    ) {
        const userId = req.user.id;
        const decodedListTitle = decodeURIComponent(listName);
        const decodedTitle = decodeURIComponent(formattedBookName);
        return await this.readingListService.createNewList(userId, decodedListTitle, decodedTitle);
    }

}
