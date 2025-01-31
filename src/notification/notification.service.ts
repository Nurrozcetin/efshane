import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class NotifyService{
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getNotification(userId: string){
        return this.prisma.notification.findMany({
            where: {
                userId: parseInt(userId),
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profile_image: true,
                    }
                },
                author: { 
                    select: {
                        username: true,
                        profile_image: true,
                    }
                }
            }
        });
    }

    async deleteNotification(notifyId: string) {
        return this.prisma.notification.delete({
            where: {
                id: parseInt(notifyId),
            },
        });
    }
}