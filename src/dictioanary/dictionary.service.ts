import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DictionaryService {
    constructor(private readonly httpService: HttpService) {}

    async getWordDefinition(word: string): Promise<any> {
        const apiUrl = `https://sozluk.gov.tr/gts?ara=${word}`;
        const response = await firstValueFrom(this.httpService.get(apiUrl));
        return response.data;
    }
}
