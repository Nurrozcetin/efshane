import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAudioBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    normalizedTitle: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    summary: string;

    @IsOptional()
    @IsString()
    audioFile: string;

    @IsNotEmpty()
    @IsString()
    duration: string;

    @IsNotEmpty()
    @IsString()
    bookCover: string;

    @IsOptional()
    @IsInt()
    bookId: number;

    @IsString()
    categories: string; 
    ageRange: string;
    bookCopyright: string;

    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];

    publish_date: Date = new Date();
}