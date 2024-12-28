import {IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsInt()
    userId: number;

    createdAt: Date = new Date();
}