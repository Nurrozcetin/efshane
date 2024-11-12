import { Injectable } from "@nestjs/common";
import { SendMessageDto } from "./dto/create-message.dto";
import { PrismaService } from "prisma/prisma.service";
import { EncryptionService } from "./encryption.service";

@Injectable()
export class MessageService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly encryptService: EncryptionService,
    ){}

    async sendMessage(sendMessageDto: SendMessageDto, senderId: number) {
        const { receiverUserName, content, date } = sendMessageDto;
    
        const encryContent = this.encryptService.encrypt(content);

        const receiver = await this.prisma.user.findUnique({
            where: {
                username: receiverUserName,  
            },
            select: {
                id: true,  
                profile_image: true,  
                username: true,
            },
        });
    
        if (!receiver) {
            throw new Error('Alıcı kullanıcı bulunamadı.');
        }
    
        const message = await this.prisma.messages.create({
            data: {
                senderId,
                receiverId: receiver.id, 
                content: encryContent,
                date: date || new Date(),
            },
        });
    
        const sender = await this.prisma.user.findUnique({
            where: { id: senderId },
            select: {
                username: true,
                profile_image: true,
            },
        });
    
        if (!sender) {
            throw new Error('Gönderici kullanıcı bulunamadı.');
        }
    
        const baseUrl = 'http://localhost:5173';  
    
        const newMessage = {
            id: message.id,
            senderImage: `${baseUrl}/${sender.profile_image}`,
            sender: sender.username,
            content: this.encryptService.decrypt(message.content),
            senderUsername: true,
            sendDate: message.date.toISOString(),
            receiverImage: `${baseUrl}/${receiver.profile_image}`,
            receiverUsername: receiver.username,  
        };        
        return newMessage;
    }

    async getMessagesForUser(userId: number) {
        const messages = await this.prisma.messages.findMany({
            where: {
                OR: [
                    { receiverId: userId },
                    { senderId: userId }
                ],
                NOT: {
                    visible: {
                        some: {
                            isVisible: false,
                        },
                    },
                },
            },
            include: {
                sender: { 
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                receiver: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        
        const lastMessages = messages.reduce((acc, message) => {
            const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            const otherUsername = message.senderId === userId ? message.receiver.username : message.sender.username;
            const otherImage = message.senderId === userId ? message.receiver.profile_image : message.sender.profile_image;
    
            if (!acc[otherUserId] || new Date(message.date) > new Date(acc[otherUserId].sendDate)) {
                acc[otherUserId] = {
                    id: message.id,
                    content: this.encryptService.decrypt(message.content),
                    sendDate: message.date,
                    isRead: message.isRead,
                    otherUsername: otherUsername,
                    otherImage: otherImage,
                    isSender: message.senderId === userId,
                };
            }
            return acc;
        }, {});
    
        const formattedMessages = Object.values(lastMessages);
    
        return formattedMessages;
    }

    async getConversation(username: string, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
    
        if (!user) {
            throw new Error('Kullanıcı bulunamadı.');
        }
    
        const otherUserId = user.id;
    
        const messages = await this.prisma.messages.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
                NOT: {
                    visible: {
                        some: {
                            isVisible: false,
                        },
                    },
                },
            },
            include: {
                sender: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
                receiver: {
                    select: {
                        username: true,
                        profile_image: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
    
        const baseUrl = 'http://localhost:5173';
    
        const processedMessages = messages.map((message) => {
            const senderUsername = message.sender?.username;
            const receiverUsername = message.receiver?.username;
            const senderProfileImage = `${baseUrl}/${message.sender.profile_image}`;
            const receiverProfileImage = `${baseUrl}/${message.receiver.profile_image}`;
    
            return {
                id: message.id,
                content: this.encryptService.decrypt(message.content),
                userId: message.senderId,
                otherUserId: message.receiverId,
                username: senderUsername,
                otherUsername: receiverUsername,
                profileImage: senderProfileImage,
                otherProfileImage: receiverProfileImage,
                date: message.date.toISOString(),
                sentByCurrentUser: senderUsername === username, 
            };
        });
        return processedMessages;
    }

    async markAsRead(messageIds: number[], userId: number) {
        const messageIDArray = messageIds.map(id => id);

        const messages = await this.prisma.messages.findMany({
            where: {
                id: { in: messageIDArray }, 
                OR: [
                    { receiverId: userId },  
                    { senderId: userId },   
                ],
            },
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                isRead: true,
                date: true,  
            },
        });
    
        if (messages.length !== messageIDArray.length) {
            throw new Error('Bir veya daha fazla mesaj bulunamadı.');
        }
    
        const updatedMessages = [];
        for (const message of messages) {            
            if (message.receiverId !== userId && message.senderId !== userId) {
                throw new Error('Bazı mesajlara okuma izniniz yok.');
            }
    
            if (message.isRead) {
                updatedMessages.push({ id: message.id, status: 'zaten okundu' });
                continue;  
            }
    
            await this.prisma.messages.update({
                where: { id: message.id },
                data: { isRead: true },
            });
    
            updatedMessages.push({ id: message.id, status: 'okundu' });
        }
    
        return { message: 'Mesajlar başarıyla okundu olarak işaretlendi.', updatedMessages };
    }
    
    async hideConversation(messageId: string, userId: number) {
        const messageID = parseInt(messageId);
        const message = await this.prisma.messages.findUnique({
            where: { id: messageID },
            select: { senderId: true, receiverId: true },
        });
    
        if (!message) {
            console.log('Mesaj bulunamadı');
            throw new Error('Mesaj bulunamadı');
        }
    
        const { senderId, receiverId } = message;
    
        if (userId !== senderId && userId !== receiverId) {
            throw new Error('Bu mesajı gizlemek için yetkiniz yok.');
        }
    
        const messages = await this.prisma.messages.findMany({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
            select: { id: true },
        });
    
        if (!messages.length) {
            console.log('Bu iki kullanıcı arasında mesaj bulunamadı.');
            return;
        }
    
        const messageIds = messages.map(message => message.id);
    
        const visibilityData = messageIds.flatMap((messageId) => [
            { messageId, userId: userId, isVisible: false },
            { messageId, userId: userId, isVisible: false },
        ]);
        
        await this.prisma.messageVisibility.createMany({
            data: visibilityData,
        });

        console.log('Tüm mesajlar başarıyla gizlendi.');
    }
}