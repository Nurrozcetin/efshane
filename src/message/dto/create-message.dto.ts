import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    receiverId: number;
    
    senderId: number;

    @IsOptional()
    date: Date = new Date();
}