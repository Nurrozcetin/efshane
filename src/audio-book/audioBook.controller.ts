import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { AudioBookService } from "./audioBook.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { UpdateAudioBookDto } from "./dto/update-audiobook.dto";
import { UpdateChapterDto } from "src/chapter/dto/update-chapter.dto";
import { UpdateEpisodeDto } from "src/episode/dto/update-episode.dto";

@Controller('audio-book')
export class  AudioBookController {
    constructor(private readonly audioBookService: AudioBookService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAudioBook(
        @Body() body: CreateAudioBookDto,
        @Req() req
    ){
        const authorId = req.user.id;
        return this.audioBookService.createAudioBook(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('allAudioBooks')
    async getAudioBooksByAuthorId(
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.audioBookService.getAudioBooksByAuthorId(authorId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':bookTitle')
    async getAudioBookByTitle(
        @Param('bookTitle') bookTitle: string,  
        @Req() req
    ) {
        const decodedTitle = decodeURIComponent(bookTitle);
        const userId = req.user.id;
        return this.audioBookService.getAudioBookByTitle(decodedTitle, userId);
    }

    @Get('get/ageRange')
    async getAgeRange(
    ) {
        return this.audioBookService.getAgeRange();
    }

    @Get('get/copyright')
    async getCopyRight(
    ) {
        return this.audioBookService.getCopyRight();
    }

    @UseGuards(JwtAuthGuard)
    @Put('toggle/:bookTitle')
    async togglePublish(
        @Param('bookTitle') bookTitle: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const audioBook = await this.audioBookService.togglePublish(decodedTitle, authorId);
        return audioBook;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookTitle')
    async updateBook(
        @Param('bookTitle') bookTitle: string,  
        @Body() body: UpdateAudioBookDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.audioBookService.updateAudioBook(decodedTitle, body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':bookId')
    async deleteBook(
        @Param('bookId') bookId: string, 
        @Req() req) 
    {
        const authorId = req.user.id;
        return this.audioBookService.deleteBook(bookId.toString(), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('convertAudioBook/:bookTitle')
    async convertAudioBook(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.audioBookService.convertAudioBook(decodedTitle, authorId);
    }
}