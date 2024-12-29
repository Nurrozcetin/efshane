import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAnnouncementDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    date: Date = new Date();
}