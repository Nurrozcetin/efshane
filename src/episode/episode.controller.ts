import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { EpisodeService } from "./episode.service";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";
import * as path from 'path';
import * as fs from 'fs';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";

@Controller('episode')
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('audioFile'),
    )
    uploadAudio(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Ses dosyası yüklenmedi.');
        }
        console.log("Uploaded Audio:", file);
        return { filePath: `/uploads/audio/${file.filename}` };
    }

    @Post('uploadImage')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Görsel yüklenemedi.');
        }
        console.log("Uploaded Image:", file);
        return {
            filePath: `/uploads/audio/${file.filename}`,
        };
    }

    @Post('uploadText')
    @UseInterceptors(FileInterceptor('textFile'))
    uploadText(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Text yüklenemedi.');
        }
        console.log("Uploaded Text:", file);
        return {
            filePath: `/uploads/audio/${file.filename}`,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':bookTitle')
    async getAllChaptersByBookId(
        @Param('bookTitle') bookTitle: string,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.episodeService.getAllEpisodesByAudioBookTitle(authorId, decodedTitle);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save/:bookTitle')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'textFile', maxCount: 1 },
                { name: 'audioFile', maxCount: 1 },
                { name: 'image', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, callback) => {
                        const basePath = path.join(
                            __dirname,
                            '..',
                            '..',
                            'uploads',
                            'audio'
                        );
                        if (!fs.existsSync(basePath)) {
                            fs.mkdirSync(basePath, { recursive: true });
                        }
                        callback(null, basePath);
                    },
                    filename: (req, file, callback) => {
                        const uniqueSuffix =
                            Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = path.extname(file.originalname);
                        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                    },
                }),
            },
        ),
    )
    async createEpisode(
        @Param('bookTitle') bookTitle: string,
        @Body() body: CreateEpisodeDto,
        @Req() req,
        @UploadedFiles() files: {
            textFile?: Express.Multer.File[];
            audioFile?: Express.Multer.File[];
            image?: Express.Multer.File[];
        },
    ) {
        const userId = req.user.id;
        let textPath = null;
        let audioPath = null;
        let imagePath = null;

        const decodedTitle = decodeURIComponent(bookTitle);

        console.log('Received Files:', files);
    
        if (files.textFile) {
            textPath = path.join(
                'C:\\Users\\210601024\\Desktop\\efshanee\\efshane\\efshane\\uploads\\audio',
                files.textFile[0].filename,
            );
            console.log('Image File:', files.textFile[0]);
            console.log("Text Path: ", textPath);
        }
        if (files.audioFile) {
            audioPath = path.join(
                'C:\\Users\\210601024\\Desktop\\efshanee\\efshane\\efshane\\uploads\\audio',
                files.audioFile[0].filename,
            );
            console.log('Image File:', files.image[0]);
            console.log('Audio File Path:', audioPath);
        }

        if (files.image) {
            imagePath = path.join(
                'C:\\Users\\210601024\\Desktop\\efshanee\\efshane\\efshane\\uploads\\audio',
                files.image[0].filename,
            );
            console.log('Image File:', files.image[0]);
            console.log("Image Path: ", imagePath);
        }

        const episodeData = {
            ...body,
            textFile: textPath,
            audioFile: audioPath,
            image: imagePath,
        };

        return this.episodeService.createEpisode(decodedTitle, episodeData, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('publish/:bookTitle')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'textFile', maxCount: 1 },
                { name: 'audioFile', maxCount: 1 },
                { name: 'image', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, callback) => {
                        const basePath = path.resolve(__dirname, '..', 'uploads', 'audio');
                        if (!fs.existsSync(basePath)) {
                            fs.mkdirSync(basePath, { recursive: true });
                        }
                        callback(null, basePath);
                    },
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = path.extname(file.originalname);
                        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                    },
                }),
            },
        ),
    )
    async savePublishEpisode(
        @Param('bookTitle') bookTitle: string,
        @Body() body: CreateEpisodeDto,
        @Req() req,
        @UploadedFiles() files: {
            textFile?: Express.Multer.File[];
            audioFile?: Express.Multer.File[];
            image?: Express.Multer.File[];
        },
    ) {
        const userId = req.user.id;
    
        const decodedTitle = decodeURIComponent(bookTitle);
    
        console.log('Received Files:', files);
    
        const textPath = files.textFile && files.textFile[0] ? files.textFile[0].path : null;
        const audioPath = files.audioFile && files.audioFile[0] ? files.audioFile[0].path : null;
        const imagePath = files.image && files.image[0] ? files.image[0].path : null;
    
        const episodeData = {
            ...body,
            textFile: textPath,
            audioFile: audioPath,
            image: imagePath,
        };
    
        return this.episodeService.publishCreateEpisode(decodedTitle, episodeData, userId);
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
        const decodedEpisodeTitle = decodeURIComponent(title);
        return this.episodeService.deleteChapter(decodedTitle, decodedEpisodeTitle, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('toggle/:bookTitle/:title')
    async togglePublish(
        @Param('bookTitle') bookTitle: string, 
        @Param('title') title: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const decodedEpisodeTitle = decodeURIComponent(title);
        const book = await this.episodeService.togglePublish(decodedTitle, decodedEpisodeTitle, authorId);
        return book;
    }

    //var olan bölümü editleme
    @UseGuards(JwtAuthGuard)
    @Put('save/:bookTitle/:episodeId')
    async saveUpdateEpisode(
        @Param('bookTitle') bookTitle: string, 
        @Param('episodeId') episodeId: string, 
        @Body() episodeDto: UpdateEpisodeDto,
        @Req() req
    ) {
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const episode = await this.episodeService.saveUpdateEpisode(decodedTitle, episodeId, episodeDto, authorId);
        return episode;
    }
}
