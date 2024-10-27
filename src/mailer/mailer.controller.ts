import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ResetPasswordDto } from './dto/resetPass.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ContactUsDto } from './dto/contactUs.dto';

@Controller('mail')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @Post('sendCode')
    async sendVerificationCode(
        @Body() user: ResetPasswordDto,
    ) {
        const verificationCodeData = await this.mailerService.generateVerificationCode(user.email);
        const expiresInMinutes = 2; 

        await this.mailerService.sendMailForPassword(user);

        return { message: 'Doğrulama kodu başarıyla gönderildi.', expiresAt: verificationCodeData.expiresAt };
    }

    @Post('verifyCode')
    async verifyCode(
        @Body('email') email: string,
        @Body('code') enteredCode: string, 
    ) {
        const isCodeValid = await this.mailerService.verifyCode(email, enteredCode);

        if (isCodeValid) {
            return { message: 'Doğrulama kodu başarılı.' };
        }

        return { message: 'Doğrulama kodu başarısız.' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('contactUs')
    async sendContactMail(
        @Body() contactUsDto: ContactUsDto
    ) {
        await this.mailerService.sendContactMail(contactUsDto);
        return { message: 'Mail başarıyla gönderildi.' };
    }
}
