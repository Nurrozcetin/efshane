import {IsInt, IsOptional, IsString } from "class-validator";

export class CreateEpisodeDto {
    id: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    audioFile?: string;

    @IsOptional()
    @IsString()
    textFile?: string;

    @IsOptional()
    @IsString()
    duration?: string;
    
    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsInt()
    audiobookId: number;

    publish: boolean;

    publish_date: Date = new Date();
}