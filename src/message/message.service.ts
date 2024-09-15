import { Injectable } from "@nestjs/common";
import { SendMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "prisma/prisma.service";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class MessageService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly encry: EncryptionService,
    ){}

    async sendMessage(sendMessageDto: SendMessageDto, senderId: number) {
        const {receiverId, content } = sendMessageDto;

        const encryContent = this.encry.encrypt(content);

        const message = await this.prisma.messages.create({
            data: {
                senderId,
                receiverId,
                content: encryContent,
                date: new Date(),
            },
        });
        return message;
    }
    

    async getMessagesForReceiver(receiverId: number) {
        const messages = await this.prisma.messages.findMany({
            where: { receiverId: receiverId },
            include: {
                sender: true,
                receiver: true
            },
        });
    
        return messages.map(message => ({
            ...message,
            content: this.encry.decrypt(message.content)
            }));
        }

        async updateMessage(updateData: string, messageId: string, senderId: number) {
            const encryContent = this.encry.encrypt(updateData);
            await this.prisma.messages.update({
                where: {
                    id: parseInt(messageId, 10),
                    senderId, 
                },
                data: {
                    content: encryContent,
                },
            });
            return { message: 'Message updated successfully.' };
        }
    
}