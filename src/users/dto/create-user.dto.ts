import { IsEmail, IsInt, IsNotEmpty, Matches } from 'class-validator';
export class CreateUserDto{
    id: string;

    @IsEmail({},{ message: 'Enter valid e-mail address!' })
    email: string;

    @IsNotEmpty({ message: 'Username can not empty!' })
    username: string; 

    @IsNotEmpty({ message: 'Password can not empty!' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password cannot be empty. Password must contain at least one uppercase letter, one number and one special character.',
  })
  password: string;

    @IsInt()
    age: number;
    profile_image: string;
    image_background: string;
    about?: string;
}