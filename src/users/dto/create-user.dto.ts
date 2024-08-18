export class CreateUserDto{
    id: number;
    email: string;
    username: string; 
    password: string;
    age: number;
    image: string;
    image_background: string;
    about?: string;
}