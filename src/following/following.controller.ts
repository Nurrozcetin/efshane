import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { FollowingService } from "./following.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@Controller('following')
export class FollowingController{
    constructor(
        private readonly followingService: FollowingService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('follow/:followingId')
    async followUser(
        @Param('followingId') followingId: string,
        @Req() req
    ) {
        const followerID = req.user.id; 
        const followingID = parseInt(followingId, 10);
        return await this.followingService.followUser(followerID, followingID);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollow/:followingId')
    async unfollowUser(
        @Param('followingId') followingId: string,
        @Req() req
    ) {
        const followerID = req.user.id; 
        const followingID = parseInt(followingId, 10);
        return await this.followingService.unfollowUser(followerID, followingID);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getFollowers(
        @Req() req
    ) {
        const followerID = req.user.id; 
        return await this.followingService.getFollowingRecord(followerID);
    }

}