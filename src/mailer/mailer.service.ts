import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/resetPass.dto';
import { ContactUsDto } from './dto/contactUs.dto';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;
    private verificationCodes: Map<string, { code: string; expiresAt: Date }> = new Map(); 

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "efshaneapp@gmail.com",
                pass: "xalo smjn llpe bjgz"
            },
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: "efshaneapp@gmail.com",
            to,
            subject,
            text,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-posta başarıyla gönderildi: %s', info.messageId);
        } catch (error) {
            console.error('E-posta gönderim hatası: ', error);
        }
    }

    async generateVerificationCode(email: string) {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(new Date().getTime() + 2 * 60 * 1000);
        this.verificationCodes.set(email, { code, expiresAt }); 
        return { code, expiresAt };
    }

    async sendMailForPassword(user: ResetPasswordDto) {
        const { code, expiresAt } = await this.generateVerificationCode(user.email);
        await this.sendMail(
            user.email,
            "Şifre Yenileme Doğrulama Kodu",
            `Merhaba,\n\nŞifrenizi yenilemek için bir talepte bulundunuz. Aşağıda sizin için oluşturulan doğrulama kodunu bulabilirsiniz. Lütfen bu kodu şifre yenileme sayfasına girin:\n\nDoğrulama Kodu: ${code}\n\nBu kod yalnızca ${expiresAt} dakika boyunca geçerli olacaktır. Şifrenizi yenilemek için ilgili sayfada bu kodu girdikten sonra, yeni bir şifre belirleyebilirsiniz.\n\nEğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın ve hesabınızın güvenliğini sağlamak için bizimle hemen iletişime geçin.\n\nTeşekkürler,\nEFshane Ekibi`,
        );
    }

    async verifyCode(email: string, enteredCode: string): Promise<boolean> {
        const storedCodeData = this.verificationCodes.get(email); 
        console.log(storedCodeData);
        
        if (!storedCodeData) {
            throw new Error('Doğrulama kodu bulunamadı.');
        }

        console.log('Saklanan Kod:', storedCodeData.code);
        console.log('Girilen Kod:', enteredCode);

        if (new Date() > storedCodeData.expiresAt) {
            throw new Error('Doğrulama kodunun süresi dolmuş.');
        }

        if (storedCodeData.code !== enteredCode) {
            throw new Error('Doğrulama kodu yanlış.');
        }

        return true;
    }

    async sendContactMail(contactUsDto: ContactUsDto) {
        const { email, title, description } = contactUsDto;
        const mailOptions = {
            from: email,
            to: `efshaneapp@gmail.com`,
            subject: `Bize Ulaşın - ${title}`,
            text: description
        }
        try {
            const info = await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error('Dinamik e-posta gönderimi başarısız.');
        }
    }
}
