import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserService } from "src/users/users.service";
import { PasswordService } from "./password.service";
import { Injectable } from "@nestjs/common";
import { IPayload } from "../constants/types";

@Injectable()
export class AuthService {
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

        // Compare the plain-text password with the stored hashed password
        const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            console.log('The password is invalid');
            return null;
        }

        return user;
    }

    async login(user: any) {
        const payload: IPayload = {
            sub: user.id,
            email: user.email,
        };
        const token = this.jwtService.sign(payload);
        console.log(token);
        return {
            accessToken: token,
        };
    }

    async register(createUserDto: CreateUserDto) {
        createUserDto.password = await this.passwordService.hashPassword(createUserDto.password);

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
