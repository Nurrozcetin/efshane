import {IsOptional, IsString } from "class-validator";

export class UpdateAudioBookDto {
    id: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    duration: string;

    @IsOptional()
    bookCover: string;

    publish_date: Date = new Date();
}

