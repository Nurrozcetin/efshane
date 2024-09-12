import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class FollowingService{
    constructor(
        private readonly prisma: PrismaService
    ){}

    async followUser(
        followerId: number,
        followingId: number
    ) {
        if (followerId === followingId) {
            throw new Error('Users cannot follow themselves.');
        }

        try {
            return await this.prisma.following.create({
                data: {
                    followersId: followerId,
                    followingId: followingId,
                },
            });
        } catch (error) {
            throw new Error('Could not follow user')
        }
    }

    async unfollowUser(followerId: number, followingId: number) {
        const  following = await this.prisma.following.findFirst({
            where:{
                followersId: followerId,
                followingId: followingId,
            },
        });

        if(!following) {
            throw new NotFoundException('Following relationship does not exist.');
        }
        return await this.prisma.following.delete({
            where:{
                id: following.id
            },
        });
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