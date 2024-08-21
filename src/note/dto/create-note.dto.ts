import { IsInt, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;
}