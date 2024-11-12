import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
    id: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    content: string;

    @IsNotEmpty()
    @IsString()
    receiverUserName: string;

    @IsOptional()
    date : Date = new Date();
}