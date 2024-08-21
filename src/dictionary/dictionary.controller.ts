import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DictionaryServices } from "./dictionary.service";
import { CreateDictionaryDto } from "./dto/create-dict.dto";
import { SpeechDto } from "./dto/speech.dto";

@Controller('dict')
export class DictionaryController{
    constructor(
        private readonly dictionaryService: DictionaryServices,
    ){}

    @Post()
    async createDictionary(@Body() body: CreateDictionaryDto) {
        return this.dictionaryService.createDictionary(body);
    }

    @Get()
    getAllDictionary() {
        return this.dictionaryService.getAllDictionary();
    }

    @Post('speech') 
        createSpeech(@Body() body: SpeechDto) {
        return this.dictionaryService.createSpeech(body);
    }

    @Get(':id')
    getDictionaryWithSpeeches(@Param('id') id: string) {
      return this.dictionaryService.getDictionaryWithSpeeches(+id);
    }
}
