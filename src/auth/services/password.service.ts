import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        return hash(password, salt);
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return compare(plainPassword, hashedPassword);
    }
}
