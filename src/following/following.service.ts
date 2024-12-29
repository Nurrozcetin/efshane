import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class FollowingService{
    constructor(
        private readonly prisma: PrismaService
    ){}

    async followUser(followerId: string, username: string) {
        try {
            const followingId = await this.prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
    
            if (!followingId) {
                throw new Error('User not found');
            }
    
            return await this.prisma.following.create({
                data: {
                    followersId: followingId.id, 
                    followingId: parseInt(followerId, 10),
                },
            });
        } catch (error) {
            throw new Error('Could not follow user');
        }
    }
    

    async unfollowUser(followerId: string, username: string) {
        try {
            const followingId = await this.prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
    
            if (!followingId) {
                throw new Error('User not found');
            }
    
            await this.prisma.following.delete({
                where: {
                    followersId_followingId: {
                        followersId:  followingId.id, 
                        followingId: parseInt(followerId, 10),
                    },
                },
            });
    
            return { success: true, message: 'Successfully unfollowed user' };
        } catch (error) {
            throw new Error('Could not unfollow user');
        }
    }
    

    async isFollowing(username: string, followerId: string) {
        const userId = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        const following = await this.prisma.following.findUnique({
            where: {
                followersId_followingId: {
                    followersId: parseInt(followerId, 10),
                    followingId: userId.id
                }
            },
        });
        return !!following;
    }

    async getFollowingRecord( userId: number){
        return  await this.prisma.following.findMany({
            where:{
                followersId: userId,
            },
            include: {
                following: true,
            }
        });
    }
}