import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
