import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

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
}
