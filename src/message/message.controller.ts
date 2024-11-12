import { MessageService } from "./message.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { SendMessageDto } from "./dto/create-message.dto";
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";

@Controller('message')
export class MessageController {
    constructor (
        private readonly messageService: MessageService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('send')
    async sendMessage(
        @Body() body: SendMessageDto,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.messageService.sendMessage(body, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('inbox')
    async getMessagesForUser(@Req() req) {
        const receiverId = req.user.id; 
        return this.messageService.getMessagesForUser(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('conversation/:username')
    async getConversation(
        @Param('username') username: string,
        @Req() req
    ) {
        const userId = req.user.id; 
        return this.messageService.getConversation(username, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('markAsRead')
    async markAsRead(
        @Body() body: { messageIds: number[] },
        @Req() req
    ) {
        const userID = req.user.id; 
        return this.messageService.markAsRead(body.messageIds, userID);
    }

    @UseGuards(JwtAuthGuard)
    @Post('hideConversation')
    async hideConversation(
        @Body() body: { messageId: string },
        @Req() req
    ) {
        const userID = req.user.id;
        return this.messageService.hideConversation(body.messageId, userID);
    }
}