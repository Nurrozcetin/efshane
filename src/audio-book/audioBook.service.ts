import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";

@Injectable()
export class AudioBookService {
    constructor(private prisma: PrismaService) {}
    /*async createAudioBook(createAudioBookDto: CreateAudioBookDto, userId) {
        const { bookId, episodes, duration } = createAudioBookDto;
    
        let sections;
        if (bookId) {
            sections = await this.prisma.section.findMany({
                where: { bookId },
            });
    
            if (!sections.length) {
                throw new NotFoundException('No sections found for the given book');
            }
        }
    
        const audiobook = await this.prisma.audioBook.create({
            data: {
                title: sections ? sections[0].title : createAudioBookDto.title,
                bookCover: sections ? sections[0].book.bookCover : createAudioBookDto.bookCover,
                duration,
                bookId,
                userId,
                publish_date: createAudioBookDto.publish_date || new Date(),
            },
        });
    
        if (sections) {
            for (const section of sections) {
                await this.prisma.episodes.create({
                    data: {
                        title: section.title,
                        duration: parseInt(createAudioBookDto.duration),
                        sectionId: section.id,
                        audiobookId: audiobook.id,
                        audioFile: 'path/to/audiofile',
                },
            });
        }
        } else {
            for (const episode of episodes) {
                await this.prisma.episodes.create({
                    data: {
                        title: episode.title,
                        duration: episode.duration,
                        audiobookId: audiobook.id,
                        audioFile: episode.audioFile,
                    },
                });
            }
        }
    
        return audiobook;
    }*/
}
