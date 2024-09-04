import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAnnouncementDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;
    content: string;

    @IsNotEmpty()
    @IsInt()
    authorId: number;

    @IsOptional()
    date: Date = new Date();
}