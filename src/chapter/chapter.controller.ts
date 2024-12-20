import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @UseGuards(JwtAuthGuard)
    @Get('get/:bookTitle/:chapterTitle')
    async getChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        return this.chapterService.getChapter(decodedTitle, decodedChapterTitle, authorId);
    }

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
        const decodedTitle = decodeURIComponent(bookTitle);
        const chapter = await this.chapterService.publishCreateChapter(decodedTitle, body, authorId);
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
    @Get(':bookTitle')
    async getAllChaptersByBookId(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.getAllChaptersByBookTitle(authorId, decodedTitle);
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
    @Put('save/:bookTitle/:chapterTitle')
    async saveUpdateChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @Body() chapterDto: UpdateChapterDto,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        const chapter = await this.chapterService.saveUpdateChapter(decodedTitle, decodedChapterTitle, chapterDto, authorId);
        return chapter;
    }

    @UseGuards(JwtAuthGuard)
    @Put('update/publish/:bookTitle/:chapterTitle')
    async publishUpdateChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @Body() body: CreateChapterDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        const chapter = await this.chapterService.publishUpdateChapter(decodedTitle, decodedChapterTitle, body, authorId);
        return chapter;
    }
}