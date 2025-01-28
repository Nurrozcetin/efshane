import { FeedController } from './feed/feed.controller';
import { EncryptionService } from './message/encryption.service';
import { BookService } from './book/book.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './announcement/anons.module';
import { AnnouncementController } from './announcement/anons.controller';
import { AnnouncementService } from './announcement/anons.service';
import { ChapterModule } from './chapter/chapter.module';
import { ChapterController } from './chapter/chapter.controller';
import { ChapterService } from './chapter/chapter.service';
import { CommentModule } from './comment/comment.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { NotifyController } from './notification/notification.controller';
import { NotifyService } from './notification/notification.service';
import { NotifyModule } from './notification/notification.module';
import { ReadingListController } from './reading-list/readingList.controller';
import { ReadingListService } from './reading-list/readingList.service';
import { ReadingListModule } from './reading-list/readingList.module';
import { BookCaseModule } from './book-case/bookCase.module';
import { BookCaseService } from './book-case/bookCase.service';
import { BookCaseController } from './book-case/bookCase.controller';
import { FollowingModule } from './following/following.module';
import { FollowingService } from './following/following.service';
import { FollowingController } from './following/following.controller';
import { BookController } from './book/book.controller';
import { BookModule } from './book/book.module';
import { EpisodeModule } from './episode/episode.module';
import { EpisodeService } from './episode/episode.service';
import { EpisodeController } from './episode/episode.controller';
import { AudioBookModule } from './audio-book/audioBook.module';
import { AudioBookController } from './audio-book/audioBook.controller';
import { AudioBookService } from './audio-book/audioBook.service';
import { HttpModule } from '@nestjs/axios';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';
import { ConfigService } from '@nestjs/config';
import { MailerController } from './mailer/mailer.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HelpService } from './help/help.service';
import { HelpController } from './help/help.controller';
import { HelpModule } from './help/help.module';
import {MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { FeedModule } from './feed/feed.module';
import { FeedService } from './feed/feed.service';
import { NotificationsGateway } from './notification/notification.gateway';
import { MessagesGateway } from './message/message.gateway';
import { ProgressModule } from './progress/progress.module';
import { ProgressService } from './progress/progress.service';
import { ProgressController } from './progress/progress.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads', 
      serveStaticOptions: {
        fallthrough: false, 
      },
    }),
    PrismaModule, UsersModule, AuthModule, AnnouncementModule, ChapterModule, CommentModule, MessageModule, CategoryModule, NotifyModule, CategoryModule, ReadingListModule, BookCaseModule, FollowingModule, BookModule, EpisodeModule, AudioBookModule, HttpModule, MailerModule, HelpModule, NestjsFormDataModule, FeedModule, NotificationsGateway, MessagesGateway, ProgressModule],
  controllers: [AppController, UserController, AuthController, AnnouncementController, ChapterController, CommentController, MessageController, CategoryController, NotifyController, ReadingListController, BookCaseController, FollowingController, BookController, EpisodeController, AudioBookController, MailerController, HelpController, FeedController, ProgressController],
  providers: [AppService, UserService, AnnouncementService, ChapterService, CommentService, MessageService, EncryptionService, CategoryService, NotifyService, ReadingListService, BookCaseService, FollowingService, BookService, EpisodeService, AudioBookService, MailerService, ConfigService, HelpService, FeedService, NotificationsGateway, MessagesGateway, ProgressService],
})
export class AppModule {}
