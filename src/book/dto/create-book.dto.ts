import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    bookCover: string;

    publish: boolean;

    publish_date: Date = new Date();
}