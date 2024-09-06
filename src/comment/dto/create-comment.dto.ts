import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    @IsOptional()
    @IsInt()
    sectionId: number;
}
