import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsInt, IsNotEmpty, Matches } from 'class-validator';

export class UserDto{
    id: string;

    @IsNotEmpty({ message: 'Email can not empty!' })
    @IsEmail({},{ message: 'Enter valid e-mail address!' })
    email: string;

    @IsNotEmpty({ message: 'Username can not empty!' })
    username: string; 

    @IsNotEmpty({ message: 'Password can not empty!' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character.'
    })
    password: string;

    @IsInt()
    age: number;
    
    profile_image: string;
    image_background: string;
    about?: string;

    @IsDate()
    @Transform(({ value }) => new Date(value)) 
    birthdate: Date;
}
