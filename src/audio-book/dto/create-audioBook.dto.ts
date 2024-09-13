import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateAudioBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    duration: string;

    @IsNotEmpty()
    @IsString()
    bookCover: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    publish_date: Date = new Date();
}