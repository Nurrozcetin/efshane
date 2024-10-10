import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto{
    id: string;

    @IsNotEmpty({ message: 'Email can not empty!' })
    @IsEmail({},{ message: 'Enter valid e-mail address!' })
    email: string;

    @IsNotEmpty({ message: 'Password can not empty!' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character.'
    })
    password: string;
}
