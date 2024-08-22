import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './note/note.module';
import { NotesController } from './note/note.controller';
import { NotesServices } from './note/note.service';
import { AnalysisService } from './analysis/analysis.service';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, NotesModule, AnalysisModule],
  controllers: [AppController, UserController, AuthController, NotesController, AnalysisModule],
  providers: [AppService, UserService, NotesServices, AnalysisService],
})
export class AppModule {}
