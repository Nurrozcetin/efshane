import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
    @IsEmail({}, { message: "Email is invalid!" }) 
    @IsNotEmpty({ message: "Email can not be empty!" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Password can not be empty!" })
    @Matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, { message: "Password must contain at least one uppercase letter, one number, and one special character." })
    pass: string;
}
