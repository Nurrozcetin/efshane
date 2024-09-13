import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateEpisodeDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    audioFile: string;

    @IsNotEmpty()
    @IsInt()
    duration: number;

    publish: boolean;

    publish_date: Date = new Date();
}