import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { genSalt, hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";
import { UserService } from "src/users/users.service";

@Injectable()
export class PasswordService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        return bcryptHash(password, salt);
    }

    async compare(provided: string, stored: string): Promise<boolean> {
        return bcryptCompare(provided, stored);
    }
}
