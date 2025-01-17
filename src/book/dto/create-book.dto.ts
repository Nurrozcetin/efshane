import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    normalizedTitle: string;

    @IsNotEmpty()
    @IsString()
    summary: string;

    @IsOptional()
    @IsString()
    bookCover?: string;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true) 
    isAudioBook: boolean;
    
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
    
    @IsString()
    categories: string; 
    ageRange: string;
    bookCopyright: string;

    publish_date: Date = new Date();
}