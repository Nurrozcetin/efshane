import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
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
    @Post('book/:bookId/:chapterId')
    async createCommentByChapterId(
        @Param('bookId') bookId: string,
        @Param('chapterId') chapterId: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            return this.commentService.createCommentByChapterId(bookId, chapterId, body, userId);
        }

    @UseGuards(JwtAuthGuard)
    @Post('audioBook/:audioBookId/:episodeId')
    async createCommentByEpisodeId(
        @Param('audioBookId') audioBookId: string,
        @Param('episodeId') episodeId: string,
        @Body() body: CreateCommentDto,
        @Req() req
        ) {
            const userId = req.user.id; 
            return this.commentService.createCommentByEpisodeId(audioBookId, episodeId, body, userId);
        }
        
    @UseGuards(JwtAuthGuard)
    @Get('book/:bookId')
    async getAllCommentsByBookId(
        @Param('bookId') bookId: number,
    ) {
        return this.commentService.getAllCommentsByBookId(String(bookId));
    }

    @UseGuards(JwtAuthGuard)
    @Get('audioBook/:audioBookId')
    async getAllCommentsByAudioBookId(
        @Param('audioBookId') audioBookId: number,
    ) {
        return this.commentService.getAllCommentsByAudioBookId(String(audioBookId));
    }

    @UseGuards(JwtAuthGuard)
    @Get('book/:bookId/:chapterId')
    async getAllCommentsByChaptersId(
        @Param('bookId') bookId: number,
        @Param('chapterId') chapterId: number,
    ) {
        return this.commentService.getAllCommentsByChaptersId(String(bookId), String(chapterId));
    }

    @UseGuards(JwtAuthGuard)
    @Get('audioBook/:audioBookId/:episodesId')
    async getAllCommentsByEpisodesId(
        @Param('audioBookId') audioBookId: number,
        @Param('episodesId') episodesId: number,
    ) {
        return this.commentService.getAllCommentsByEpisodesId(String(audioBookId), String(episodesId));
    }

    @UseGuards(JwtAuthGuard)
    @Delete('book/:bookId/:commentId')
    async deleteCommentsByBookId(
        @Param('bookId') bookId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsByBookId(bookId, commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('audioBook/:audioBookId/:commentId')
    async deleteCommentsByAudioBookId(
        @Param('audioBookId') audioBookId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsByAudioBookId(audioBookId, commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('book/:bookId/:chapterId/:commentId')
    async deleteCommentsByChapterId(
        @Param('bookId') bookId: string,
        @Param('chapterId') chapterId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsByChapterId(bookId, chapterId, commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('audioBook/:audioBookId/:episodesId/:commentId')
    async deleteCommentsByEpisodesId(
        @Param('audioBookId') audioBookId: string,
        @Param('episodesId') episodesId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsByEpisodesId(audioBookId, episodesId, commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('book/:bookId/:commentId')
    async updateCommentsByBookId(
        @Param('bookId') bookId: string,
        @Param('commentId') commentId: string,
        @Body() body: CreateCommentDto,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.updateCommentsByBookId(bookId, commentId, body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('audioBook/:audioBookId/:commentId')
    async updateCommentsByAudioBookId(
        @Param('audioBookId') audioBookId: string,
        @Param('commentId') commentId: string,
        @Body() body: CreateCommentDto,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.updateCommentsByAudioBookId(audioBookId, commentId, body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('book/:bookId/:chapterId/:commentId')
    async updateCommentsByChapterId(
        @Param('bookId') bookId: string,
        @Param('chapterId') chapterId: string,
        @Param('commentId') commentId: string,
        @Body() body: CreateCommentDto,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.updateCommentsByChapterId(bookId, chapterId, commentId, body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('audioBook/:audioBookId/:episodesId/:commentId')
    async updateCommentsByEpisodesId(
        @Param('audioBookId') audioBookId: string,
        @Param('episodesId') episodesId: string,
        @Param('commentId') commentId: string,
        @Body() body: CreateCommentDto,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.updateCommentsByEpisodesId(audioBookId, episodesId, commentId, body, userId);
    }
}


