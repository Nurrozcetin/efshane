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
import { CommentModule } from './comment/comment.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { EncryptionService } from './message/encryption.service';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, NotesModule, AnalysisModule, AnnouncementModule, SectionModule, CommentModule, MessageModule],
  controllers: [AppController, UserController, AuthController, NotesController, AnalysisController, AnnouncementController, SectionController, CommentController, MessageController],
  providers: [AppService, UserService, PrivateNotesService, AnalysisService, AnnouncementService, SectionService, CommentService, MessageService, EncryptionService],
})
export class AppModule {}
