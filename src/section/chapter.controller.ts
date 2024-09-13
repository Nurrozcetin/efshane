import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateChapterDto } from "./dto/create-chapter.dto";

@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createChapter(
        @Param('bookId') bookId: number, 
        @Body() body: CreateChapterDto, 
        @Req() req)
    {
        const authorId = req.user.id;
        return this.chapterService.createChapter(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':authorId/:bookId')
    async getAllChaptersByBookId(
        @Param('authorId') authorId: number,
        @Param('bookId') bookId: number,
    ) {
        return this.chapterService.getAllChaptersByBookId(String(authorId), String(bookId));
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':bookId/:chaptersId')
    async deleteAllChaptersByBookId(
        @Param('bookId') bookId: number, 
        @Param('chaptersId') chaptersId: number, 
        @Body() body: CreateChapterDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        return this.chapterService.deleteAllChaptersByBookId(String(bookId), String(chaptersId), authorId);
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
