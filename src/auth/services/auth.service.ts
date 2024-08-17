import {Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/users.service";
import { PasswordService } from "./password.service";
import { IPayload } from "../constants/types";
import { access } from "fs";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService{
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private passwordService: PasswordService,
    ) {}

    async validateUser(email: string, password:string): Promise<any> {
        const user = await this. userService.getUserByEmail(email);
        const comparePassword = await this.passwordService.compare(
            password,
            user.password,
        );
        if(user && comparePassword){
            const{password, ...result} = user;
            return result;
        }
        return null;
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
        const token = this.jwtService.sign(payload);
          return {
            accessToken: token,
        };
    }
}

