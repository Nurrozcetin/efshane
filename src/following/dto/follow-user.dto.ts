import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
    @IsInt()
    @IsNotEmpty()
    followersId: number; 

    @IsInt()
    @IsNotEmpty()
    followingId: number; 
}