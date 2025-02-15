import { IsDate, IsOptional, IsString,  } from 'class-validator';

export class UpdateUserDto{
    @IsString()
    @IsOptional()
    name?: string; 
    
    @IsOptional()
    @IsString()
    about?: string; 

    @IsOptional()
    @IsString()
    image_background?: string; 

    @IsOptional()
    @IsString()
    profile_image?: string; 

    @IsOptional()
    birthdate?: Date

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
