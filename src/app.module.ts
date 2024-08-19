import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { SectionModule } from './section/section.module';
import { SectionController } from './section/section.controller';
import { SectionService } from './section/section.service';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SectionModule],
  controllers: [AppController, UserController, AuthController, SectionController],
  providers: [AppService, UserService, SectionService],
})
export class AppModule {}
