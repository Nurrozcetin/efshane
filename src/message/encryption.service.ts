import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key = Buffer.from('3878d37ccead0747502a62cbe8e96f9a6ce4344ad8297c1572d8fadab4c1d056', 'hex');
    private readonly iv = Buffer.from('9d4f7d9e1e6b41f6f82b1056d2d3b340', 'hex');

    constructor() {
        if (this.key.length !== 32) {
            throw new Error('Invalid key length. AES-256-CBC requires a 32-byte key.');
        }
        if (this.iv.length !== 16) {
            throw new Error('Invalid IV length. AES-256-CBC requires a 16-byte IV.');
        }
    }

    encrypt(text: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    decrypt(encryptedText: string): string {
        try {
            const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
            let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error('Şifre çözme işleminde bir hata oluştu:', error);
            throw new Error('Şifre çözme işleminde bir hata oluştu.');
        }
    }
    
}
