import { AudioBook } from './../../node_modules/.prisma/client/index.d';
import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { text } from 'stream/consumers';
import * as os from 'os';

@Injectable()
export class EpisodeService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getAllEpisodesByAudioBookTitle(authorId: number, decodedTitle: string) {
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase() 
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '') 
                .replace(/ş/g, 's') 
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '') 
                .trim() 
                .replace(/\s+/g, '-'); 
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
        
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: authorId,
            },
        });        

        const userBook = audioBooks.find(audioBook => audioBook.userId === authorId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }

        if(userBook.userId !== authorId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add chapters.')
        } 

        const episodes = await this.prisma.episodes.findMany({
            where: {
                userId: authorId,
                audiobookId: userBook.id,
            },
            include: {
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        read_count: true
                    }
                }
            }
        });
    
        if (!episodes || episodes.length === 0) {
            throw new NotFoundException(`No episodes found for the book titled "${decodedTitle}".`);
        }
        return episodes;
    }
    
    async createEpisode(
        decodedTitle: string,
        episodeDto: CreateEpisodeDto,
        userId: number,
    ) {
        const { title, audioFile, textFile, duration, publish, image } = episodeDto;
        const normalizeTitle = (title: string): string => {
            return title
                .toLowerCase()
                .normalize('NFC')
                .replace(/[̀-\u036f]/g, '')
                .replace(/ş/g, 's')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
    
        if (!decodedTitle) {
            throw new BadRequestException('Title parameter is required.');
        }
        
        console.log("Text File:", textFile);
        console.log("Audio File:", audioFile);
        console.log("Image File:", image);

        if (!audioFile && !textFile) {
            throw new BadRequestException('You must provide at least one of audioFile, or textFile.');
        }
    
        if ((audioFile && textFile)) {
            throw new BadRequestException('You can only provide one of audioFile, or textFile.');
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });
    
        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException('This audiobook does not exist. Please enter the correct audio book title.');
        }
    
        if (userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add episodes.');
        }
    
        const decodedNormalizeEpisodeTitle = normalizeTitle(title);

        const existingEpisode = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: decodedNormalizeEpisodeTitle,
                audiobookId: userBook.id,
            },
        });
    
        if (existingEpisode) {
            throw new ConflictException('An episode with the same title already exists for this audio book.');
        }

        const episode = await this.prisma.episodes.create({
            data: {
                title,
                audioFile: audioFile || null,
                textFile: textFile || null,
                duration: duration || "00:00:00",
                normalizedTitle: decodedNormalizeEpisodeTitle,
                audiobookId: userBook.id,
                userId: userId,
                publish: !!publish || false,
                image: image || null,
                publish_date: new Date(),
            },
        });        
        const bookDuration = userBook.duration || '00:00:00';
        const [bookHours, bookMinutes, bookSeconds] = bookDuration.split(':').map(Number);
        const [episodeHours, episodeMinutes, episodeSeconds] = bookDuration.split(':').map(Number);
    
        const bookDurationInSeconds = (bookHours || 0) * 3600 + (bookMinutes || 0) * 60 + (bookSeconds || 0);
        const episodeDurationInSeconds = (episodeHours || 0) * 3600 + (episodeMinutes || 0) * 60 + (episodeSeconds || 0);
    
        const totalDurationInSeconds = bookDurationInSeconds + episodeDurationInSeconds;
    
        const updatedHours = Math.floor(totalDurationInSeconds / 3600);
        const updatedMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
        const updatedSeconds = totalDurationInSeconds % 60;
    
        const updatedDuration = `${updatedHours.toString().padStart(2, '0')}:${updatedMinutes
            .toString()
            .padStart(2, '0')}:${updatedSeconds.toString().padStart(2, '0')}`;
    
        await this.prisma.audioBook.update({
            where: { id: userBook.id },
            data: { duration: updatedDuration },
        });
        return episode;
    }

    async publishCreateEpisode(
        decodedTitle: string,
        episodeDto: CreateEpisodeDto,
        userId: number,
    ) {
        const { title, audioFile, textFile, duration, publish, image } = episodeDto;
    
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase()
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ş/g, 's')
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
    
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });
    
        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }
    
        if (userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add any episode.');
        }
    
        const decodedEpisodeNormalizedTitle = normalizeTitle(title);
        const existingEpisode = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: decodedEpisodeNormalizedTitle,
                audiobookId: userBook.id,
            },
        });
    
        if (existingEpisode) {
            throw new ConflictException('A episode with the same title already exists for this audio book.');
        }

        let audioFilePath: string | null = audioFile || null;
        if (audioFile) {
            if (fs.existsSync(audioFile)) {
                const fileContent = fs.readFileSync(audioFile);
                const tempFilePath = path.join(os.tmpdir(), `temp_${uuidv4()}.wav`);
        
                fs.writeFileSync(tempFilePath, fileContent);
        
                const content = await this.transcribeAudioFile(tempFilePath);
        
                if (content.offensive) {
                    throw new BadRequestException("Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
                }

                fs.unlinkSync(tempFilePath);
            } else {
                throw new BadRequestException('Audio file path is invalid or file does not exist.');
            }
        }
        
        if (textFile) {
            const contentCheckResult = await this.readTextFile(textFile);
        
            if (contentCheckResult.offensive) {
                console.log("Text content contains offensive language.");
                throw new BadRequestException("Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
            }

            if (contentCheckResult.audioFilePath) {
                audioFilePath = contentCheckResult.audioFilePath;
            }
        }        

        const episode = await this.prisma.episodes.create({
            data: {
                title,
                audioFile: audioFilePath,
                textFile: textFile || null,
                duration: duration || "00:00:00",
                normalizedTitle: decodedEpisodeNormalizedTitle,
                audiobookId: userBook.id,
                userId: userId,
                publish: !!publish || false,
                image: image || null,
                publish_date: new Date(),
            },
        });      

        const bookDuration = userBook.duration || '00:00:00';
        const [bookHours, bookMinutes, bookSeconds] = bookDuration.split(':').map(Number);
        const [episodeHours, episodeMinutes, episodeSeconds] = bookDuration.split(':').map(Number);
    
        const bookDurationInSeconds = (bookHours || 0) * 3600 + (bookMinutes || 0) * 60 + (bookSeconds || 0);
        const episodeDurationInSeconds = (episodeHours || 0) * 3600 + (episodeMinutes || 0) * 60 + (episodeSeconds || 0);
    
        const totalDurationInSeconds = bookDurationInSeconds + episodeDurationInSeconds;
    
        const updatedHours = Math.floor(totalDurationInSeconds / 3600);
        const updatedMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
        const updatedSeconds = totalDurationInSeconds % 60;
    
        const updatedDuration = `${updatedHours.toString().padStart(2, '0')}:${updatedMinutes
            .toString()
            .padStart(2, '0')}:${updatedSeconds.toString().padStart(2, '0')}`;
    
        await this.prisma.audioBook.update({
            where: { id: userBook.id },
            data: { duration: updatedDuration },
        });

        console.log("Episode:", episode);
        return { success: true, offensive: false, episode };
    }

    private async transcribeAudioFile(audioFilePath: string): Promise<{ offensive: boolean }> {
        const transcribe = await axios.post('https://ca59-34-148-137-2.ngrok-free.app/speech_to_text', {
            audioFile: fs.createReadStream(audioFilePath) 
        }, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 1200000 });
    
        console.log("Transcribe:", transcribe.data);
    
        const analyze = await axios.post('https://ca59-34-148-137-2.ngrok-free.app/analyze', {
            text: transcribe.data.transcription,
        }, { timeout: 90000 });
    
        console.log("Analyze:", analyze.data);
    
        if (analyze.data.is_offensive) {
            console.log("Analyze is offensive");
            return { offensive: true };
        } else {
            console.log("Audio file successfully saved.");
            return { offensive: false };
        }
    }

    private async readTextFile(filePath: string): Promise<{ offensive: boolean, audioFilePath?: string }> {
        const absolutePath = path.isAbsolute(filePath) 
        ? filePath 
        : path.resolve(__dirname, '..dist/src/dist/uploads/audio', filePath);
        console.log('Final Path:', absolutePath);
        console.log('Reading file from path:', absolutePath);
        if (!fs.existsSync(filePath)) {
            throw new HttpException('File not found.', HttpStatus.BAD_REQUEST);
        }
        try {
            if (!fs.existsSync(absolutePath)) {
                throw new HttpException('File not found.', HttpStatus.BAD_REQUEST);
            }
            const content = await fs.promises.readFile(absolutePath, 'utf8');

            const response = await axios.post('https://ca59-34-148-137-2.ngrok-free.app/analyze', { text: content }, { timeout: 90000 });
            console.log('Response:', response.data);

            if (response.data.is_offensive) {
                return { offensive: true };
            }

            const text_to_speech = await axios.post(`http://127.0.0.1:8000/text_to_speech`, {content: content}, { responseType: 'stream', timeout: 100000 } );
            
            const outputDir = path.resolve(__dirname, '..', 'uploads', 'output');
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            const tempFilePath = path.join(outputDir, `output_${uuidv4()}.mp3`);
            const writer = fs.createWriteStream(tempFilePath);

            console.log("Path:", tempFilePath);

            await new Promise((resolve, reject) => {
                text_to_speech.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const audioFile = fs.readFileSync(tempFilePath);
            fs.unlinkSync(tempFilePath); 

            console.log('Audio file successfully created.');
            return { offensive: false, audioFilePath: tempFilePath };

        } catch (error) {
            console.error('Error reading or analyzing file:', error.message);
            throw new HttpException('File analysis or text-to-speech failed.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    //var olan bölümü editleme
    async saveUpdateEpisode( 
        decodedTitle: string,
        episodeId: string,
        episodeDto: UpdateEpisodeDto,
        userId: number
    ) {
        const { title, image, textFile, audioFile, publish_date, duration, publish } = episodeDto;
        const normalizeTitle = (title: string | undefined) => {
            return title
                .toLowerCase() 
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '') 
                .replace(/ş/g, 's') 
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '') 
                .trim() 
                .replace(/\s+/g, '-'); 
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });        

        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }

        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add episodes.')
        }
    
        const episodeID = parseInt(episodeId, 10);
        if (isNaN(episodeID)) {
            throw new BadRequestException("Invalid episode ID.");
        }
        
        const episode = await this.prisma.episodes.findFirst({
            where: {
                id: episodeID,
                audiobookId: userBook.id,
            },
        });
        
        const processedImage = image && image.trim() !== "" ? image : null;
        const updatedEpisode = await this.prisma.episodes.update({
            where: { id: episode.id },
            data: {
                title,
                image: processedImage,
                audioFile: audioFile || episode.audioFile,
                textFile: textFile || episode.textFile,
                duration: duration || episode.duration,
                normalizedTitle: normalizeTitle(title),
                publish: publish !== undefined ? !!publish : episode.publish,
                publish_date: new Date(),
            },
        });

        const bookDuration = userBook.duration || '00:00:00';
        const [bookHours, bookMinutes, bookSeconds] = bookDuration.split(':').map(Number);
        const [episodeHours, episodeMinutes, episodeSeconds] = bookDuration.split(':').map(Number);
    
        const bookDurationInSeconds = (bookHours || 0) * 3600 + (bookMinutes || 0) * 60 + (bookSeconds || 0);
        const episodeDurationInSeconds = (episodeHours || 0) * 3600 + (episodeMinutes || 0) * 60 + (episodeSeconds || 0);
    
        const totalDurationInSeconds = bookDurationInSeconds + episodeDurationInSeconds;
    
        const updatedHours = Math.floor(totalDurationInSeconds / 3600);
        const updatedMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
        const updatedSeconds = totalDurationInSeconds % 60;
    
        const updatedDuration = `${updatedHours.toString().padStart(2, '0')}:${updatedMinutes
            .toString()
            .padStart(2, '0')}:${updatedSeconds.toString().padStart(2, '0')}`;
    
        await this.prisma.audioBook.update({
            where: { id: userBook.id },
            data: { duration: updatedDuration },
        });
    
        console.log("Episode:", updatedEpisode);    
        return updatedEpisode;
    }

    async togglePublish(
        decodedTitle: string,
        decodedEpisodeTitle: string,
        userId: number,
    ) {
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase() 
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '') 
                .replace(/ş/g, 's') 
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '') 
                .trim() 
                .replace(/\s+/g, '-'); 
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
        
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: userId,
            },
        });        

        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }

        const existingEpisode = await this.prisma.episodes.findFirst({
            where: {
                title: decodedEpisodeTitle,
                audiobookId: userBook.id,
            },
        });
    
        if (!existingEpisode) {
            throw new NotFoundException('This episode does not exist for the specified audio book.');
        }

        const updatedEpisode = await this.prisma.episodes.update({
            where: {
                id: userBook.id,
            },
            data: {
                publish: !existingEpisode.publish, 
            },
        });
    
        return updatedEpisode;
    }  

    async deleteChapter(
        decodedTitle: string,
        decodedEpisodeTitle: string,
        userId: number
    ) {
        const normalizeTitle = (title: string) => {
            return title
                .toLowerCase() 
                .normalize('NFC')
                .replace(/[\u0300-\u036f]/g, '') 
                .replace(/ş/g, 's') 
                .replace(/ç/g, 'c')
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ö/g, 'o')
                .replace(/ı/g, 'i')
                .replace(/[^a-z0-9\s-]/g, '') 
                .trim() 
                .replace(/\s+/g, '-'); 
        };
    
        const decodedNormalizedTitle = normalizeTitle(decodedTitle);
        
        if (!decodedTitle) {
            throw new BadRequestException("Title parameter is required.");
        }
    
        const audioBooks = await this.prisma.audioBook.findMany({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId,
            },
        });        

        const userBook = audioBooks.find(audioBook => audioBook.userId === userId);
    
        if (!userBook) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }

        if(userBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add chapters.')
        } 
    
        const existingEpisodes = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: decodedEpisodeTitle,
                audiobookId: userBook.id as number,
            },
        });
    
        if (!existingEpisodes) {
            throw new NotFoundException('This episodes does not exist.');
        }
    
        await this.prisma.episodes.delete({
            where: { id: existingEpisodes.id },
        });
    
        return { message: 'Episodes deleted successfully.' };
    }
}