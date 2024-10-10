export class UserEntity {
    id: number;
    email: string;
    username: string; 
    password: string;
    birthdate: Date;
    age: number;
    profile_image: string;
    image_background: string;
    about?: string;
}