import { Controller, Get, Post, Param, Body, UseGuards, Patch, Delete } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/assign-hashtag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('hashtags')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}

    @Get()
    async getSuggestedHashtags() {
        return this.hashtagService.getSuggestedHashtags();
    }

    //@UseGuards(JwtAuthGuard)
    @Post('book/:bookId')
    async assignOrCreateHashtagsToBook(
        @Param('bookId') bookId: string,
        @Body('hashtags') hashtags: string[],
    ) {
        const bookID = parseInt(bookId, 10);
        return this.hashtagService.assignOrCreateHashtagsToBook(bookID, hashtags);
    }

    @UseGuards(JwtAuthGuard)
    @Get('book/:bookId')
    async getHashtagsByBook(@Param('bookId') bookId: string) {
        const bookID = parseInt(bookId, 10);
        return this.hashtagService.getHashtagsByBook(bookID);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('book/:bookId')
    async updateHashtagsForBook(
        @Param('bookId') bookId: string,
        @Body() createHashtagDto: CreateHashtagDto,
    ) {
        const bookID = parseInt(bookId, 10);
        return this.hashtagService.updateHashtagsForBook(bookID, createHashtagDto.hashtagIds);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('book/:bookId/:hashtagId')
    async removeHashtagFromBook(
        @Param('bookId') bookId: string,
        @Param('hashtagId') hashtagId: string) {
            const bookID = parseInt(bookId, 10);
            const hashtagID = parseInt(hashtagId, 10);
            return this.hashtagService.removeHashtagFromBook(bookID, hashtagID);
    }

    @UseGuards(JwtAuthGuard)
    @Post('audiobook/:audioBookId')
    async assignOrCreateHashtagsToAudioBook(
        @Param('audioBookId') audioBookId: string,
        @Body('hashtags') hashtags: string[],
    ) {
        const audioBookID = parseInt(audioBookId, 10);
        return this.hashtagService.assignOrCreateHashtagsToAudioBook(audioBookID, hashtags);
    }

    @UseGuards(JwtAuthGuard)
    @Get('audiobook/:audioBookId')
    async getHashtagsByAudioBook(@Param('audioBookId') audioBookId: string) {
        const audioBookID = parseInt(audioBookId, 10);
        return this.hashtagService.getHashtagsByAudioBook(audioBookID);
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('audiobook/:audioBookId')
    async updateHashtagsForAudioBook(
        @Param('audioBookId') audioBookId: string,
        @Body() createHashtagDto: CreateHashtagDto,
    ) {
        const audioBookID = parseInt(audioBookId, 10);
        return this.hashtagService.updateHashtagsForAudioBook(audioBookID, createHashtagDto.hashtagIds);
    }

    @Delete('audiobook/:audiobookId/:hashtagId')
    async removeHashtagFromAudioBook(
        @Param('audiobookId') audiobookId: string,
        @Param('hashtagId') hashtagId: string) {
            const audiobookID = parseInt(audiobookId, 10);
            const hashtagID = parseInt(hashtagId, 10);
            return this.hashtagService.removeHashtagFromAudioBook(audiobookID, hashtagID);
    }
}
