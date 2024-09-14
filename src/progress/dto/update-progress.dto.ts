import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class UpdateProgressDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    //yuzde olarak ilerleme guncellenecektir
    @IsNotEmpty()
    @IsInt()
    @Min(0)  
    @Max(100)
    progress: number; 
}
