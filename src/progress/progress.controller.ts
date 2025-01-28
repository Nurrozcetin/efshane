import { Controller, Post, Param, Body, UseGuards, Req, Get, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post('book/:bookTitle/chapter/:chapterId')
    async updateBookProgress(
        @Param('bookTitle') bookTitle: string,
        @Param('chapterId') chapterId: string,
        @Req() req: any,
    ) {
        const userId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return await this.progressService.createOrUpdateBookProgress(parseInt(userId), decodedTitle, parseInt(chapterId));
    }

    @Get('book/:bookTitle')
    async getLastReadChapter(
        @Param('bookTitle') bookTitle: string,
        @Req() req: any,
    ) {
        const userId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return await this.progressService.getLastReadChapter(userId, decodedTitle);
    }
}
