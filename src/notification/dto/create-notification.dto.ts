import {IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    id: number;

    @IsNotEmpty()
    @IsString()
    message: string;

    userId: number;
    
    isRead: boolean;

    @IsOptional()
    createdAt: Date = new Date();
}