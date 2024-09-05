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
import { AnalysisService } from './analysis/analysis.service';
import { AnalysisModule } from './analysis/analysis.module';
import { AnalysisController } from './analysis/analysis.controller';
import { AnnouncementModule } from './announcement/anons.module';
import { AnnouncementController } from './announcement/annons.controller';
import { AnnouncementService } from './announcement/anons.service';
import { PrivateNotesService } from './note/note.service';
import { SectionModule } from './section/section.module';
import { SectionController } from './section/section.controller';
import { SectionService } from './section/section.service';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, NotesModule, AnalysisModule, AnnouncementModule, SectionModule],
  controllers: [AppController, UserController, AuthController, NotesController, AnalysisController, AnnouncementController, SectionController],
  providers: [AppService, UserService, PrivateNotesService, AnalysisService, AnnouncementService, SectionService],
})
export class AppModule {}
