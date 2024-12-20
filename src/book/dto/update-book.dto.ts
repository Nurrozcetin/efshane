import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {
    id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    normalizedTitle?: string;

    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    bookCover?: string;

    @IsOptional()
    publish_date?: Date = new Date();

    @IsOptional()
    @IsBoolean()
    publish?: boolean

    @IsOptional()
    @IsBoolean()
    isAudioBook?: boolean;
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];
    
    @IsOptional()
    @IsString()
    categories?: string; 

    @IsOptional()
    @IsString()
    ageRange?: string;

    @IsOptional()
    @IsString()
    bookCopyright?: string;
}

