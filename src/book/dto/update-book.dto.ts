import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {
    id: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    summary: string;

    @IsOptional()
    bookCover: string;

    publish_date: Date = new Date();

    @IsOptional()
    @IsBoolean()
    publish: boolean
}

