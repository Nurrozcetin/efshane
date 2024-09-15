import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { SendMessageDto } from "./dto/create-message.dto";

@Controller('message')
export class MessageController{
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
    async getMessagesForReceiver(@Req() req) {
        const receiverId = req.user.id; 
        return this.messageService.getMessagesForReceiver(receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':messageId')
    async updateMessage(
            @Param('messageId') messageId: string,
            @Body() body: SendMessageDto,
            @Req() req
        ) {
            const senderId = req.user.id; 
            return this.messageService.updateMessage(body.content, messageId, senderId);
        }
}