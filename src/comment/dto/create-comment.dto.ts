import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    @IsOptional()
    @IsInt()
    sectionId: number;

    userId: number;
}