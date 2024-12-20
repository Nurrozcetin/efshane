import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateChapterDto {
    id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    image?: string;

    bookId: number;

    date: Date = new Date();
}