import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddFollowingDto {
    id: string;

    @IsNotEmpty()
    @IsInt()
    followersId: string;

    @IsNotEmpty()
    @IsInt()
    followingId: string;

    @IsOptional()
    date: Date = new Date();
}