import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateEpisodeDto {
    id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    audioFile?: string;

    @IsOptional()
    @IsString()
    textFile?: string;

    @IsOptional()
    @IsString()
    duration?: string

    @IsOptional()
    @IsString()
    image?: string;

    publish: boolean;

    publish_date: Date = new Date();

    @IsOptional()
    @IsInt()
    audiobookId: number;
}