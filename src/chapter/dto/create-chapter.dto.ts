import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChapterDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image?: string;

    bookId: number;

    date: Date = new Date();
}