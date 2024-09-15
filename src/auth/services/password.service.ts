import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
    // Hash the password
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        return hash(password, salt);
    }

    // Compare the plain-text password with the hashed password
    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return compare(plainPassword, hashedPassword);
    }
}
