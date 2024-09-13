import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAudioBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    bookCover: string;

    @IsNotEmpty()
    @IsString()
    duration: string;

    @IsNotEmpty()
    @IsString()
    episodes: string;

    @IsOptional()
    publish_date: Date = new Date();

    @IsInt()
    bookId: number;
}