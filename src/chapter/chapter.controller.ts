import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateChapterDto } from "./dto/create-chapter.dto";

@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':bookTitle') 
    async createChapter(
        @Param('bookTitle') bookTitle: string, 
        @Body() body: CreateChapterDto, 
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.createChapter(decodedTitle, body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('publish/:bookTitle')
    async publishCreateChapter(
        @Param('bookTitle') bookTitle: string, 
        @Body() body: CreateChapterDto, 
        @Req() req
    ){

        const authorId = req.user.id;
        const chapter = await this.chapterService.publishCreateChapter(bookTitle, body, authorId);
        return chapter;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookTitle/:title')
    async togglePublishChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('title') title: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(title);
        const chapter = await this.chapterService.togglePublishChapter(decodedTitle, decodedChapterTitle, authorId);
        return chapter;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':title')
    async getAllChaptersByBookId(
        @Param('title') title: string,
        @Req() req
    ) {
        const authorId = req.user?.id;
        if (!authorId) {
            throw new BadRequestException("Invalid user ID provided.");
        }
        const book = await this.chapterService.getAllChaptersByBookTitle(authorId, title);
        return book;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':bookTitle/:title')
    async deleteChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('title') title: string, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(title);
        return this.chapterService.deleteChapter(decodedTitle, decodedChapterTitle, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookId/:chaptersId')
    async updateAllChaptersByBookId(
        @Param('bookId')  bookId: number, 
        @Param('chaptersId')  chaptersId: number, 
        @Body() body: CreateChapterDto,     
        @Req() req
    ){
        const authorId = req.user.id;
        return this.chapterService.updateAllChaptersByBookId(String(bookId), String(chaptersId), body, authorId);
    }
}
