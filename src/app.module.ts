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
import { NotesModule } from './note/note.module';
import { NotesController } from './note/note.controller';
import { NotesServices } from './note/note.service';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SectionModule, NotesModule],
  controllers: [AppController, UserController, AuthController, SectionController, NotesController],
  providers: [AppService, UserService, SectionService, NotesServices],
})
export class AppModule {}
