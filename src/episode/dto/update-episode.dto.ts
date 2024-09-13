import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateEpisodeDto {
    id: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    audioFile: string;

    @IsOptional()
    @IsInt()
    duration: number;

    publish_date: Date = new Date();

    @IsOptional()
    @IsInt()
    audiobookId: number;
}