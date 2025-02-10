import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { AudioBookService } from "./audioBook.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { UpdateAudioBookDto } from "./dto/update-audiobook.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { PrismaService } from "prisma/prisma.service";
import { NotificationsGateway } from "src/notification/notification.gateway";

const storage = diskStorage({
    destination: './uploads', 
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop(); 
        callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});
@Controller('audio-book')
export class  AudioBookController {
    constructor(
        private readonly audioBookService: AudioBookService,
        private readonly prisma: PrismaService,
        private readonly notificationGateway: NotificationsGateway
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('bookCover', {
            storage,
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error('Invalid file type'), false);
                }
            },
        }),
    )
    async createAudioBook(
        @UploadedFile() bookCover: Express.Multer.File,
        @Body() body: CreateAudioBookDto,
        @Req() req
    ){
        const authorId = req.user.id;
        const bookCoverPath = bookCover?.path;
        return this.audioBookService.createAudioBook({...body, bookCover: bookCoverPath}, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('allAudioBooks')
    async getAudioBooksByAuthorId(
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.audioBookService.getAudioBooksByAuthorId(authorId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':bookTitle')
    async getAudioBookByTitle(
        @Param('bookTitle') bookTitle: string,  
        @Req() req
    ) {
        const decodedTitle = decodeURIComponent(bookTitle);
        const userId = req.user.id;
        return this.audioBookService.getAudioBookByTitle(decodedTitle, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('home/:bookTitle')
    async getAudioBookForHome(
        @Param('bookTitle') bookTitle: string,  
        @Req() req
    ) {
        const decodedTitle = decodeURIComponent(bookTitle);
        const userId = req.user.id;
        return this.audioBookService.getAudioBookForHome(decodedTitle, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('like/:bookTitle')
    async toggleLikeAudioBook(
        @Param('bookTitle') bookTitle: string, 
        @Req() req
    ) {
        const userId = req.user.id; 
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.audioBookService.toggleLikeAudioBook(decodedTitle, userId);
    }

    @Get('get/ageRange')
    async getAgeRange(
    ) {
        return this.audioBookService.getAgeRange();
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookTitle')
    async updateBook(
        @Param('bookTitle') bookTitle: string,  
        @Body() body: UpdateAudioBookDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.audioBookService.updateAudioBook(decodedTitle, body, authorId);
    }

    @Get('get/copyright')
    async getCopyRight(
    ) {
        return this.audioBookService.getCopyRight();
    }

    @UseGuards(JwtAuthGuard)
    @Put('toggle/:bookTitle')
    async togglePublish(
        @Param('bookTitle') bookTitle: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return await this.audioBookService.togglePublishWithNotifications(decodedTitle, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':bookId')
    async deleteBook(
        @Param('bookId') bookId: string, 
        @Req() req) 
    {
        const authorId = req.user.id;
        return this.audioBookService.deleteBook(bookId.toString(), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('convertAudioBook/:bookTitle')
    async convertAudioBook(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.audioBookService.convertAudioBook(decodedTitle, authorId);
    }
}