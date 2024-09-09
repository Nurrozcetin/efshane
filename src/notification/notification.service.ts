import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { GetNotificationsDto } from "./dto/get-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

@Injectable()
export class NotifyService{
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createNotification(createNotificationDto: CreateNotificationDto) {
        const { userId, message } = createNotificationDto;
        return this.prisma.notification.create({
            data: {
                userId,
                message,
                isRead: false,
                createdAt: new Date(),
            },
        });
    }

    async getNotification(getNotificationsDto: GetNotificationsDto){
        const { userId } = getNotificationsDto;

        return this.prisma.notification.findMany({
            where: {
                userId,
                isRead: false
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

    async markAsRead( notifyId: number, updateNotificationDto: UpdateNotificationDto) {
        const {isRead} = updateNotificationDto;
        return this.prisma.notification.update({
            where: {id: notifyId},
            data:{isRead},
        });
    }
}