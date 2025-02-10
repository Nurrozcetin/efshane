import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-anons.dto';
import { NotificationsGateway } from 'src/notification/notification.gateway';

@Injectable()
export class AnnouncementService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsGateway: NotificationsGateway,
    ) {}

    async createAnnouncement(createAnnouncementDto: CreateAnnouncementDto, authorId: number) {
        const { content } = createAnnouncementDto;
    
        const announcement = await this.prisma.announcement.create({
            data: {
                content,
                authorId,
            },
        });
    
        const followers = await this.prisma.following.findMany({
            where: { followingId: authorId },  
            select: { followersId: true },
        });
    
        const author = await this.prisma.user.findUnique({
            where: { id: authorId },
            select: {
                username: true,
                profile_image: true,
            }
        });
    
        for (const follower of followers) {
            const notificationData = {
                message: `${content}`,
                authorUsername: author.username,
                authorProfileImage: author.profile_image || 'default-profile.jpg'
            };
    
            this.notificationsGateway.sendNotificationToUser(follower.followersId, notificationData);
    
            await this.prisma.notification.create({
                data: {
                    userId: follower.followersId,
                    authorId: authorId,
                    message: notificationData.message,
                },
            });
        }
    
        return announcement;
    }
    
    async getAllNAnnonsByAuthorId(authorId: number){
        const anons = await this.prisma.announcement.findMany({
            where:{
                authorId,
            },
        });

        if (!anons || (anons).length === 0) {
            throw new NotFoundException(`No anons found for user ${authorId}`);
        }
        return anons;
    }

    async deleteAllAnnonsByAuthorId(authorId: number, anonsId: string){
        const anonsID = parseInt(anonsId, 10);
        const anons = await this.prisma.announcement.deleteMany({
            where: {
                id: anonsID,
                authorId,
            },
        });
        return anons;
    }

    async getAnonsByAuthorUsername(username: string) {
        const anons = await this.prisma.announcement.findMany({
            where: {
                author: {
                    username: username,
                },
            },
            select: {
                id: true,
                content: true,
                date: true,
                author: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        return anons;
    }
}
