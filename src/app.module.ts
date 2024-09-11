import { LibraryModule } from './library/library.module';
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
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { NotifyController } from './notification/notification.controller';
import { NotifyService } from './notification/notification.service';
import { NotifyModule } from './notification/notification.module';
import { HashtagService } from './hashtag/hashtag.service';
import { HashtagController } from './hashtag/hashtag.controller';
import { LibraryService } from './library/library.service';
import { LibraryController } from './library/library.controller';
import { ReadingListController } from './reading-list/readingList.controller';
import { ReadingListService } from './reading-list/readingList.service';
import { ReadingListModule } from './reading-list/readingList.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, NotesModule, AnalysisModule, AnnouncementModule, SectionModule, CommentModule, MessageModule, CategoryModule, NotifyModule, CategoryModule, LibraryModule, ReadingListModule],
  controllers: [AppController, UserController, AuthController, NotesController, AnalysisController, AnnouncementController, SectionController, CommentController, MessageController, CategoryController, NotifyController, HashtagController, LibraryController, ReadingListController],
  providers: [AppService, UserService, PrivateNotesService, AnalysisService, AnnouncementService, SectionService, CommentService, MessageService, EncryptionService, CategoryService, NotifyService, HashtagService, LibraryService, ReadingListService],
})
export class AppModule {}
