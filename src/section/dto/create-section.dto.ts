import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateSectionDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;
}