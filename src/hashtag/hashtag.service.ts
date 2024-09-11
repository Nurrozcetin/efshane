import { Injectable } from "@nestjs/common"
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class HashtagService {
    constructor(
        private readonly prisma : PrismaService
    ) {}

    async getSuggestedHashtags() {
        return await this.prisma.hashtags.findMany({
            where: { isDefault: true },
        });
    }

    async assignOrCreateHashtagsToBook(bookId: number, hashtags: string[]) {
        const bookHashtags = [];
    
        for (const hashtag of hashtags) {
            let existingHashtag = await this.prisma.hashtags.findUnique({
                where: { name: hashtag },
            });
    
            if (!existingHashtag) {
                existingHashtag = await this.prisma.hashtags.create({
                    data: {
                        name: hashtag,
                        isDefault: false, 
                    },
                });
            }
    
            bookHashtags.push({
                bookId,
                hashtagsId: existingHashtag.id,
            });
        }
    
        await this.prisma.bookHashtags.createMany({
            data: bookHashtags,
        });
    
        return { message: 'Hashtags assigned to book successfully.' };
    }
    
    async getHashtagsByBook(bookId: number) {
        return this.prisma.bookHashtags.findMany({
            where: { bookId },
            include: { hashtag: true },
        });
    }
    
    async updateHashtagsForBook(bookId: number, hashtagIds: number[]) {
        await this.prisma.bookHashtags.deleteMany({
            where: { bookId },
        });
        const bookHashtags = hashtagIds.map((hashtagId) => ({
            bookId,
            hashtagsId: hashtagId,
        }));
    
        await this.prisma.bookHashtags.createMany({
            data: bookHashtags,
        });
        return { message: 'Hashtags updated for book successfully.' };
    }
    
    async removeHashtagFromBook(bookId: number, hashtagId: number) {
        await this.prisma.bookHashtags.deleteMany({
            where: {
                bookId,
                hashtagsId: hashtagId,
            },
        });
    
        return { message: 'Hashtag removed from book successfully.' };
    }

    async assignOrCreateHashtagsToAudioBook(audioBookId: number, hashtags: string[]) {
        const audioBookHashtags = [];
    
        for (const hashtag of hashtags) {
            let existingHashtag = await this.prisma.hashtags.findUnique({
                where: { name: hashtag },
            });
    
            if (!existingHashtag) {
                existingHashtag = await this.prisma.hashtags.create({
                    data: {
                        name: hashtag,
                        isDefault: false, 
                    },
                });
            }
    
            audioBookHashtags.push({
                audioBookId,
                hashtagsId: existingHashtag.id,
            });
        }
    
        await this.prisma.audioBookHashtags.createMany({
            data: audioBookHashtags,
        });
    
        return { message: 'Hashtags assigned to audio book successfully.' };
    }
    
    async getHashtagsByAudioBook(audioBookId: number) {
        return this.prisma.audioBookHashtags.findMany({
            where: { audioBookId },
            include: { hashtag: true },
        });
    }
    
    async updateHashtagsForAudioBook(audioBookId: number, hashtagIds: number[]) {
        await this.prisma.audioBookHashtags.deleteMany({
            where: { audioBookId },
        });
    
        const audioBookHashtags = hashtagIds.map((hashtagId) => ({
            audioBookId,
            hashtagsId: hashtagId,
        }));
    
        await this.prisma.audioBookHashtags.createMany({
            data: audioBookHashtags,
        });
    
        return { message: 'Hashtags updated for audiobook successfully.' };
    }

    async removeHashtagFromAudioBook(audioBookId: number, hashtagId: number) {
        await this.prisma.audioBookHashtags.deleteMany({
            where: {
                audioBookId,  // Burada audioBookId doğru bir şekilde atanıyor
                hashtagsId: hashtagId,
            },
        });
    
        return { message: 'Hashtag removed from audio book successfully.' };
    }
}    
