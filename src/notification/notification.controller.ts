import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { NotifyService } from "./notification.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@Controller('notify')
export class NotifyController{
    constructor(
        private readonly notifyService: NotifyService,
    ){}
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getNotification(
        @Req() req
    ) {
        const userId = req.user.id;
        return this.notifyService.getNotification(userId);
    }

    @Delete(':notifyId')
    async deleteNotification(
        @Param('notifyId') notifyId: string,
    ) {
        console.log(notifyId);
        return this.notifyService.deleteNotification(notifyId);
    }
}