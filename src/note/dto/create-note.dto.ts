import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePrivateNoteDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;
    userId: number;
}