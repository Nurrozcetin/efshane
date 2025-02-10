import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as os from 'os';
import { NotificationsGateway } from "src/notification/notification.gateway";
@Injectable()
export class EpisodeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationGateway: NotificationsGateway,
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
                },
                audiobook: true,
            }
        });
    
        if (!episodes || episodes.length === 0) {
            throw new NotFoundException(`No episodes found for the book titled "${decodedTitle}".`);
        }
        const totalDuration = episodes.reduce((sum, episode) => sum + parseInt((episode.duration)), 0);
        return {
            ...userBook,
            episodes,
            duration: totalDuration,
        };
    }

    async getAllEpisodesByAudioBook(authorId: number, decodedTitle: string) {
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
    
        const audioBooks = await this.prisma.audioBook.findFirst({
            where: {
                OR: [
                    { normalizedTitle: decodedNormalizedTitle },
                    { title: decodedTitle },
                ],
                userId: authorId,
            },
            select: {
                id: true,
                title: true,
                like: {
                    select: {
                        id: true,
                    },
                },
                audioBookCase: {
                    select: {
                        user: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    
        if (!audioBooks) {
            throw new NotFoundException("This audio book does not exist. Please enter the correct title.");
        }
    
        const isLiked = audioBooks.like.some(like => like.id === authorId);
        const isAudioBookCase = audioBooks.audioBookCase.some(bookCase => bookCase.user.id === authorId);
    
        const episode = await this.prisma.episodes.findMany({
            where: {
                userId: authorId,
                audiobookId: audioBooks.id,
            },
            orderBy: { id: 'asc' },
            select: {
                id: true,
                title: true,
                audioFile: true,
                duration: true,
                image: true,
                analysis: {
                    select: {
                        like_count: true,
                        comment_count: true,
                        read_count: true,
                    },
                },
                comments: {
                    orderBy: { id: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        user: {
                            select: {
                                username: true,
                                profile_image: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            audioBooks: {
                id: audioBooks.id,
                title: audioBooks.title,
                isLiked: isLiked,
                isAudioBookCase: isAudioBookCase,
            },
            episode: episode.map(ep => ({
                ...ep,
                audioFile: `/uploads/audio/${ep.audioFile.split('/').pop()}`,
                image: ep.image ? `/uploads/audio/${ep.image.split('/').pop()}` : null
            })),
        };
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
        const [episodeHours, episodeMinutes, episodeSeconds] = (duration || '00:00:00').split(':').map(Number);

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
            const fileUrl = `http://localhost:3000${audioFile}`;
        
            try {
                const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                const fileContent = Buffer.from(response.data, 'binary');
        
                const tempFilePath = path.join(os.tmpdir(), `temp_${uuidv4()}.wav`);
                fs.writeFileSync(tempFilePath, fileContent);
        
                const content = await this.transcribeAudioFile(tempFilePath);
        
                if (content.offensive) {
                    throw new BadRequestException("Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
                }
                fs.unlinkSync(tempFilePath);
            } catch (error) {
                console.error("Error fetching or processing audio file:", error.message);
                throw new BadRequestException('Audio file could not be fetched or processed.');
            }
        }          

        if (textFile) {
            const fileUrl = `http://localhost:3000${textFile}`;
        
            try {
                const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                const fileContent = Buffer.from(response.data, 'utf8');

                const tempFilePath = path.join(os.tmpdir(), `temp_${uuidv4()}.txt`);
                fs.writeFileSync(tempFilePath, fileContent);
        
                const contentCheckResult = await this.readTextFile(tempFilePath);
        
                if (contentCheckResult.offensive) {
                    throw new BadRequestException("Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
                }
        
                if (contentCheckResult.audioFilePath) {
                    audioFilePath = contentCheckResult.audioFilePath; 
                }
        
                fs.unlinkSync(tempFilePath);
            } catch (error) {
                console.error("Error fetching or processing text file:", error.message);
                throw new BadRequestException('Text file could not be fetched or processed.');
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
        return { success: true, offensive: false, episode };
    }

    private async transcribeAudioFile(audioFilePath: string): Promise<{ offensive: boolean }> {
        if (!fs.existsSync(audioFilePath)) {
            throw new BadRequestException('Audio file does not exist at the specified path.');
        }

        const transcribe = await axios.post('https://7ad7-34-46-82-119.ngrok-free.app/speech_to_text', {
            audioFile: fs.createReadStream(audioFilePath) 
        }, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 1200000 });

        
        const analyze = await axios.post('https://7ad7-34-46-82-119.ngrok-free.app/analyze', {
            text: transcribe.data.transcription,
        }, { timeout: 90000 });
        

        if (analyze.data.is_offensive) {
            return { offensive: true };
        } else {
            return { offensive: false };
        }
    }

    private async readTextFile(filePath: string): Promise<{ offensive: boolean, audioFilePath?: string }> {
    
        try {
            const content = await fs.promises.readFile(filePath, 'utf8');

            try {
                const analyzeResponse = await axios.post(
                    'https://7ad7-34-46-82-119.ngrok-free.app/analyze', 
                    { text: content }, 
                    { timeout: 90000 }
                );
    
                if (analyzeResponse.data.is_offensive) {
                    return { offensive: true };
                }
            } catch (error) {
                console.log("Content analysis failed, proceeding with text-to-speech");
            }
    
            const text_to_speech = await axios.post(
                'http://127.0.0.1:8000/text_to_speech',
                { content: content },
                { timeout: 100000 }
            );
    
            if (!text_to_speech.data || !text_to_speech.data.filePath) {
                throw new Error('Invalid response from text_to_speech API.');
            }
    
            return { offensive: false, audioFilePath: text_to_speech.data.filePath };
    
        } catch (error) {
            console.error('Error in readTextFile:', error);
            if (error instanceof Error) {
                throw new BadRequestException('File processing failed: ${error.message}');
            }
            throw new BadRequestException('File processing failed with unknown error');
        }
    }

    async saveUpdateEpisode( 
        decodedTitle: string,
        episodeTitle: string,
        episodeDto: UpdateEpisodeDto,
        userId: number
    ) {
        const { title, image, textFile, audioFile, publish_date, duration, publish } = episodeDto;
        const normalizeTitle = (title: string | undefined | null): string => {
            if (!title) {
                return ''; 
            }
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
        const episodeNormalizedTitle = normalizeTitle(episodeTitle);

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
    
        const existingEpisodes = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: episodeNormalizedTitle,
                audiobookId: userBook.id as number,
            },
        });
    
        if (!existingEpisodes) {
            throw new NotFoundException('This episodes does not exist.');
        }

        const processedImage = image && image.trim() !== "" ? image : null;
        const updatedEpisode = await this.prisma.episodes.update({
            where: { id: existingEpisodes.id },
            data: {
                title,
                image: processedImage,
                audioFile: audioFile || existingEpisodes.audioFile,
                textFile: textFile || existingEpisodes.textFile,
                duration: duration || existingEpisodes.duration,
                normalizedTitle: normalizeTitle(episodeTitle),
                publish: publish !== undefined ? !!publish : existingEpisodes.publish,
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
        return updatedEpisode;
    }

    async publishUpdateEpisode( 
        decodedTitle: string,
        episodeTitle: string,
        episodeDto: UpdateEpisodeDto,
        userId: number
    ) {
        const { title, image, textFile, audioFile, publish_date, duration, publish } = episodeDto;
        const normalizeTitle = (title: string | undefined | null): string => {
            if (!title) {
                return ''; 
            }
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
        const episodeNormalizedTitle = normalizeTitle(episodeTitle);

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
    
        const existingEpisodes = await this.prisma.episodes.findFirst({
            where: {
                normalizedTitle: episodeNormalizedTitle,
                audiobookId: userBook.id as number,
            },
        });
    
        if (!existingEpisodes) {
            throw new NotFoundException('This episodes does not exist.');
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
                throw new BadRequestException("Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
            }

            if (contentCheckResult.audioFilePath) {
                audioFilePath = contentCheckResult.audioFilePath;
            }
        }        

        const processedImage = image && image.trim() !== "" ? image : null;
        const updatedEpisode = await this.prisma.episodes.update({
            where: { id: existingEpisodes.id },
            data: {
                title,
                image: processedImage,
                audioFile: audioFilePath,
                textFile: textFile || existingEpisodes.textFile,
                duration: duration || existingEpisodes.duration,
                normalizedTitle: normalizeTitle(episodeTitle),
                publish: publish !== undefined ? !!publish : existingEpisodes.publish,
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
                id: existingEpisode.id,
            },
            data: {
                publish: !existingEpisode.publish, 
            },
        });
    
        return updatedEpisode;
    }  

    async togglePublishWithNotifications(decodedTitle: string, decodedEpisodeTitle: string, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                profile_image: true,
            }
        });
        const updatedChapter = await this.togglePublish(decodedTitle, decodedEpisodeTitle, userId);
    
        if (updatedChapter.publish) {
            const followers = await this.prisma.following.findMany({
                where: { followersId: userId },
                select: { followingId: true },
            });

            for (const follower of followers) {
                const notificationData = {
                    message: `"${decodedTitle}" kitabının "${updatedChapter.title}" bölümü yayınlandı. Dinlemeye ne dersin?🎧`,
                    bookTitle: decodedTitle, 
                    chapterTitle: updatedChapter.title, 
                    chapterId: updatedChapter.id, 
                    authorUsername: user.username, 
                    authorProfileImage: user.profile_image || 'default-book-cover.jpg', 
                    isAudioBook: true,
                };
    
                this.notificationGateway.sendNotificationToUser(follower.followingId, notificationData);
    
                await this.prisma.notification.create({
                    data: {
                        userId: follower.followingId, 
                        authorId: userId, 
                        bookTitle: decodedTitle,
                        chapterTitle: updatedChapter.title,
                        isAudioBook: true,
                    },
                });
            }
        }
        return updatedChapter;
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