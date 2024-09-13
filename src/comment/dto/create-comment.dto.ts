import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsInt()
    bookId: number;

    @IsOptional()
    @IsInt()
    chapterId: number;

    @IsOptional()
    @IsInt()
    audioBookId: number;

    @IsOptional()
    @IsInt()
    episodeId: number;

    @IsOptional()
    publish_date: Date = new Date();
}
