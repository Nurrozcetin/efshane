import { Transform } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAudioBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    normalizedTitle: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    summary: string;

    @IsOptional()
    @IsString()
    audioFile: string;

    @IsNotEmpty()
    @IsString()
    duration: string;

    @IsOptional()
    @IsString()
    bookCover: string;

    @IsOptional()
    @IsInt()
    bookId: number;

    @IsString()
    categories: string; 
    ageRange: string;
    bookCopyright: string;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                
                throw new SyntaxError(`Invalid JSON for hashtags: ${value}`);
            }
        }
        if (Array.isArray(value)) {
            return value; 
        }
        return []; 
    })
    hashtags?: string[];
    
    publish_date: Date = new Date();
}