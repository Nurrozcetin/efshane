import { IsInt, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CreateDictionaryDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    word: string;

    @IsNotEmpty()
    @IsString()
    definition: string;

    date: Date
    
    @IsNotEmpty()
    @IsString()
    sentence: string;
}