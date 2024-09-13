import { Optional } from "@nestjs/common";
import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateBookDto {
    id: string;

    @Optional()
    @IsString()
    title: string;

    @Optional()
    bookCover: string;

    @Optional()
    publish_date: Date = new Date();

    @Optional()
    @IsBoolean()
    publish: boolean
}

