import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller('comment')
export  class CommentController {
    constructor(private readonly  commentService: CommentService) {}
    @UseGuards(JwtAuthGuard)
    @Post('book/:bookId')
    async createCommentByBookId(
        @Param('bookId') bookId: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            return this.commentService.createCommentByBookId(bookId, body, userId);
        }

    @UseGuards(JwtAuthGuard)
    @Post('audioBook/:audioBookId')
    async createCommentByAudioBookId(
        @Param('audioBookId') audioBookId: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            return this.commentService.createCommentByAudioBookId(audioBookId, body, userId);
        }

    @UseGuards(JwtAuthGuard)
    @Post('book/:bookTitle/:chapterTitle')
    async createCommentByChapterId(
        @Param('bookTitle') bookTitle: string,
        @Param('chapterTitle') chapterTitle: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            const decodedTitle = decodeURIComponent(bookTitle);
            const decodedChapterTitle = decodeURIComponent(chapterTitle);
            return this.commentService.createCommentByChapterId(decodedTitle, decodedChapterTitle, body, userId);
        }

    @UseGuards(JwtAuthGuard)
    @Post('audioBook/:bookTitle/:episodeTitle')
    async createCommentByEpisodeTitle(
        @Param('bookTitle') bookTitle: string,
        @Param('episodeTitle') episodeTitle: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            const decodedTitle = decodeURIComponent(bookTitle);
            const decodedEpisodeTitle = decodeURIComponent(episodeTitle);
            return this.commentService.createCommentByEpisodeTitle(decodedTitle, decodedEpisodeTitle, body, userId);
        }
}


