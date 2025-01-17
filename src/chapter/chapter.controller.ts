import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

const storage = diskStorage({
    destination: './uploads', 
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop(); 
        callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});
@Controller('chapter')
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}

    @UseGuards(JwtAuthGuard)
    @Get('get/:bookTitle/:chapterTitle')
    async getChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        return this.chapterService.getChapter(decodedTitle, decodedChapterTitle, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':bookTitle') 
    @UseInterceptors(
        FileInterceptor('image', {
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
    async createChapter(
        @Param('bookTitle') bookTitle: string, 
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateChapterDto, 
        @Req() req
    ) {
        const authorId = req.user.id;
        const imagePath = image?.path;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.createChapter(decodedTitle, {...body, image: imagePath}, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('publish/:bookTitle')
    @UseInterceptors(
        FileInterceptor('image', {
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
    async publishCreateChapter(
        @Param('bookTitle') bookTitle: string, 
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateChapterDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const imagePath = image?.path;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.publishCreateChapter(decodedTitle, {...body, image: imagePath}, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookTitle/:title')
    async togglePublishChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('title') title: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(title);
        const chapter = await this.chapterService.togglePublishChapter(decodedTitle, decodedChapterTitle, authorId);
        return chapter;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':bookTitle')
    async getAllChaptersByBookTitle(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.getAllChaptersByBookTitle(authorId, decodedTitle);
    }

    @UseGuards(JwtAuthGuard)
    @Get('read/book/:bookTitle')
    async getAllEpisodesByAudioBook(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.chapterService.getAllChaptersByBook(authorId, decodedTitle);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':bookTitle/:title')
    async deleteChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('title') title: string, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(title);
        return this.chapterService.deleteChapter(decodedTitle, decodedChapterTitle, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('save/:bookTitle/:chapterTitle')
    @UseInterceptors(
        FileInterceptor('image', {
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
    async saveUpdateChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @UploadedFile() image: Express.Multer.File,
        @Body() chapterDto: UpdateChapterDto,
        @Req() req
    ) {
        const authorId = req.user.id;
        const imagePath = image?.path;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        return this.chapterService.saveUpdateChapter(decodedTitle, decodedChapterTitle, {...chapterDto, image: imagePath}, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
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
    @Put('update/publish/:bookTitle/:chapterTitle')
    async publishUpdateChapter(
        @Param('bookTitle') bookTitle: string, 
        @Param('chapterTitle') chapterTitle: string, 
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateChapterDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const imagePath = image?.path;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedChapterTitle = decodeURIComponent(chapterTitle);
        const chapter = await this.chapterService.publishUpdateChapter(decodedTitle, decodedChapterTitle, {...body, image: imagePath}, authorId);
        return chapter;
    }
}