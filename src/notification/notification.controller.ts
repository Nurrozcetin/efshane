import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { NotifyService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { GetNotificationsDto } from "./dto/get-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

@Controller('notify')
export class NotifyController{
    constructor(
        private readonly notifyService: NotifyService,
    ){}

    @Post()
    async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notifyService.createNotification(createNotificationDto);
    }
    
    @Get('user/:userId')
    async getNotification(
        @Param('userId') userId: string
    ) {
        const getNotificationsDto: GetNotificationsDto = { userId: parseInt(userId, 10) };
        return this.notifyService.getNotification(getNotificationsDto);
    }

    @Patch(':notificationId')
    async markAsRead(
        @Param('notificationId') notificationId: string,
        @Body() updateNotificationDto: UpdateNotificationDto) {
            const notifyId = parseInt(notificationId, 10); 
            return this.notifyService.markAsRead(notifyId, updateNotificationDto);
    }
}