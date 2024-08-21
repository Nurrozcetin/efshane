import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class SpeechDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    dictId: number;
}