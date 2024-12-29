import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { FollowingService } from "./following.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@Controller('following')
export class FollowingController{
    constructor(
        private readonly followingService: FollowingService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('follow/:username')
    async followUser(
        @Param('username') username: string,
        @Req() req
    ) {
        const followerID = req.user.id; 
        return await this.followingService.followUser(followerID, username);
    }

    @UseGuards(JwtAuthGuard)
    @Post('unfollow/:username')
    async unfollowUser(
        @Param('username') username: string,
        @Req() req
    ) {
        const followerId = req.user.id; 
        return await this.followingService.unfollowUser(followerId, username);
    }

    @UseGuards(JwtAuthGuard)
    @Get('is-following/:username')
    async isFollowing(
        @Param('username') username: string,
        @Req() req
    ) {
        const followerId = req.user.id;
        return await this.followingService.isFollowing(username, followerId);
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