import { IsInt, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CreateSectionDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;
}