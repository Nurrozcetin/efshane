import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDictionaryDto } from "./dto/create-dict.dto";
import { SpeechDto } from "./dto/speech.dto";

@Injectable()
export class DictionaryServices {
    constructor(
        private readonly prisma:PrismaService
    ) {}

    async createDictionary(createDictionaryDto:CreateDictionaryDto) {
        const {word, definition, date, sentence} = createDictionaryDto;
        return this.prisma.dictionary.create({
            data: {
                word, 
                definition,
                date,
                sentence
            }
        });
    }

    async getAllDictionary(){
        return this.prisma.dictionary.findMany();
    }

    async createSpeech(speechDto: SpeechDto){
        const {name, dictId} = speechDto;
        return this.prisma.speech.create({
            data: {
                name,
                dictId
            },
        });
    }

    async getDictionaryWithSpeeches(id: number) {
        return this.prisma.dictionary.findUnique({
          where: { id },
          include: { part_of_speech: true },
        });
    }
}