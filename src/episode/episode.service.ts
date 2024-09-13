import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateEpisodeDto } from "./dto/create-episode.dto";

@Injectable()
export class EpisodeService{
    constructor(private readonly prisma: PrismaService) {}
    async createEpisodeByAudioBook( //kullanici kendi yazdigi kitap icin sesli kitap olusturur
        episodeDto: CreateEpisodeDto,
        userId: number,
        audiobookId: number,
    ) {
        const { title, audioFile, duration, publish } = episodeDto;
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: audiobookId },
        });

        if (!audioBook) {
            throw new NotFoundException('This audio book not exist. Please enter the correct audio book id.');
        }

        if(audioBook.userId !== userId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot add episodes.')
        }

        const episodes = await this.prisma.episodes.create({
            data: {
                title,
                audioFile,
                duration,
                userId,
                publish,
                audiobookId,
                publish_date: new Date(),
            },
        });
        return episodes;
    }

    async getAllEpisodesByAudioBookId(authorId: string, audiobookId: string){
        const episodes = await this.prisma.episodes.findMany({
            where:{
                userId: parseInt(authorId, 10),
                audiobookId: parseInt(audiobookId, 10),
            },
        });

        if (!episodes || (episodes).length === 0) {
            throw new NotFoundException(`No episodes found for bookId ${audiobookId}`);
        }
        return episodes;
    }


    async deleteAllEpisodesByAudioBookId(audiobookId: string, episodesId: string, authorId: number) {
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audiobookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        if (audioBook.userId !== authorId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot delete episodes.');
        }
    
        const episodes = await this.prisma.episodes.deleteMany({
            where: {
                id: parseInt(episodesId, 10),
                audiobookId: parseInt(audiobookId, 10),
            },
        });
        return episodes;
    }

    async updateAllEpisodesByAudioBookId(audiobookId: string, episodesId: string, updateData: any, authorId: number){
        const audioBook = await this.prisma.audioBook.findUnique({
            where: { id: parseInt(audiobookId, 10) },
        });
    
        if (!audioBook) {
            throw new NotFoundException('This audio book does not exist. Please enter the correct audio book id.');
        }
    
        if (audioBook.userId !== authorId) {
            throw new ForbiddenException('You are not the author of this audio book. You cannot update episodes.');
        }

        const episodes = await this.prisma.episodes.updateMany({
            where: {
                id: parseInt(episodesId, 10),
                audiobookId: parseInt(audiobookId, 10),
            },
            data: updateData,
        });
        return episodes;
    }
    
}
