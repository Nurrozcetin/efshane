import { ChangePassword } from './../../users/dto/change-pass.dto';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IPayload } from "../constants/types";
import { PasswordService } from "./password.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService{
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private passwordService: PasswordService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            console.log('User not found');
            return null;
        }
    
        const isPasswordValid = await this.passwordService.hashandComparePassword(user.password);
        if (!isPasswordValid) {
            console.log('The password is invalid');
            return null;
        }
        return user;
    }
    
    async login(user:any) {
        const payload: IPayload = {
            sub: user.id,
            email: user.email,
        };
        const token = this.jwtService.sign(payload)
        return {
            accessToken: token,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.userService.createUser(createUserDto);
        const payload: IPayload = {
            sub: user.id,
            email: user.email,
        };
        const token = this.jwtService.sign(payload)
        return {
            accessToken: token,
        };
    }
}
