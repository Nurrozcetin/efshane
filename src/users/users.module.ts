import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { PasswordService } from 'src/auth/services/password.service';

@Module({
    providers: [UserService, PrismaService, PasswordService],
    exports: [UserService],
})
export class UsersModule {}
