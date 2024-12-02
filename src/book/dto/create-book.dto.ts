import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    summary: string;

    @IsNotEmpty()
    @IsString()
    bookCover: string;

    @IsBoolean()
    isAudioBook: boolean;
    
    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];
    
    @IsString()
    categories: string; 
    ageRange: string;
    bookCopyright: string;

    publish_date: Date = new Date();
}