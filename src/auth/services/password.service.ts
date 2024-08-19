import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";
import { UserService } from "src/users/users.service";

@Injectable()
export class PasswordService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ){}

    async hashPassword(password: string) {
        const salt = await genSalt(10);
        console.log('Salt:', salt)
        const hashed = await hash(password, salt);
        const compared = await compare(password, hashed)
        return compared;
    }
    
}
