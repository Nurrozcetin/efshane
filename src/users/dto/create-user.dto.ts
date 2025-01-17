import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto{
    id: string;

    @IsNotEmpty({ message: 'Email can not empty!' })
    @IsEmail({},{ message: 'Enter valid e-mail address!' })
    email: string;

    @IsNotEmpty({ message: 'Username can not empty!' })
    username: string; 

    name: string = "User";

    @IsNotEmpty({ message: 'Password can not empty!' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message: 'Password must contain at least one uppercase letter, one number, and one special character.'
    })
    password: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    birthdate: Date;

    @IsDate()
    date: Date = new Date();
    profile_image: string = 'uploads/default-profile.jpg';
}
