import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { PasswordService } from 'src/auth/services/password.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [UserService, PrismaService, PasswordService, MailerService, ConfigService],
    exports: [UserService],
})
export class UsersModule {}
