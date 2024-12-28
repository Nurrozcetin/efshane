import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FeedService } from "./feed.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('feed')
export class FeedController{
    constructor(private readonly feedService: FeedService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfileImage(
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.getProfileImage(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getFeed(
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.getFeed(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('post')
    @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
    async createPost(
        @UploadedFile() image: Express.Multer.File,
        @Body() createPostDto: CreatePostDto,
        @Req() req
    ) {
        const userId = req.user.id;
        const imagePath = image?.path;
        return this.feedService.createPost(createPostDto, userId, imagePath);
    }

    @UseGuards(JwtAuthGuard)
    @Get('random-users')
    async getRandomUsers(
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.getRandomUsers(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('follow')
    async followUser(
        @Body('followedUserId') followedUserId: number, 
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.followUser(userId, followedUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/like/:postId')
    async likePost(
        @Param('postId') postId: string, 
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.feedService.toggleLikePost(postId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/repost/:postId')
    async repost(
        @Param('postId') postId: string,
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.toggleRepost(postId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('post/:postId')
    async sendComment(
        @Param('postId') postId: string,
        @Body('content') content: string,
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.sendComment(postId, content, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('comments/:parentCommentId')
    async reply(
        @Param('parentCommentId') parentCommentId: string,
        @Body('content') content: string,
        @Req() req
    ) {
        const userId = req.user.id;
        return this.feedService.reply(parentCommentId, content, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('comments/:postId')
    async getCommentsForPost(
        @Param('postId') postId: string) {
            const comments = await this.feedService.getCommentsForPost(postId);
            return Array.isArray(comments) ? comments : [];
    }

    @UseGuards(JwtAuthGuard)
    @Get('reply/replys/:commentId')
    async getRepliesForComment(
        @Param('commentId') commentId: string) {
        return this.feedService.getRepliesForComment(commentId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('comment/like/:commentId')
    async likeComment(
        @Param('commentId') commentId: string, 
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.feedService.likeComment(commentId, userId);
    }

}