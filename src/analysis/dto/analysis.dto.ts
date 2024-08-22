import { IsInt, IsNotEmpty } from "class-validator";

export class CreatePrivateNoteDto {
    id: string;

    @IsNotEmpty()
    @IsInt()
    like_count: number;

    @IsNotEmpty()
    @IsInt()
    view_count: number;

    @IsNotEmpty()
    @IsInt()
    read_count: number;

    @IsNotEmpty()
    @IsInt()
    sectionId: number;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    @IsNotEmpty()
    @IsInt()
    articleId: number;
}