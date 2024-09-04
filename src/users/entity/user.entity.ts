export class UserEntity {
    id: number;
    email: string;
    username: string; 
    password: string;
    age: number;
    profile_image: string;
    image_background: string;
    about?: string;
}