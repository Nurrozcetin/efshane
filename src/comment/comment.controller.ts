import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller('comment')
export  class CommentController {
    constructor(private readonly  commentService: CommentService) {}
    @UseGuards(JwtAuthGuard)
    @Get(':bookId')
    async getAllCommentsByBookId(
        @Param('bookId') bookId: number,
    ) {
        return this.commentService.getAllCommentsByBookId(String(bookId));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':bookId/:sectionId')
    async getAllCommentsBySectionsId(
        @Param('bookId') bookId: number,
        @Param('sectionId') sectionId: number,
    ) {
        return this.commentService.getAllCommentsBySectionsId(String(bookId), String(sectionId));
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':bookId/:commentId')
    async deleteCommentsByBookId(
        @Param('bookId') bookId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsByBookId(bookId, commentId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':bookId/:sectionId/:commentId')
    async deleteCommentsBySectionId(
        @Param('bookId') bookId: string,
        @Param('sectionId') sectionId: string,
        @Param('commentId') commentId: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.commentService.deleteCommentsBySectionId(bookId, sectionId, commentId, userId);
    }
}
