import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SpeechToTextService } from './speech-to-text.service';

@Injectable()
export class FileService {
    constructor(private readonly speechToTextService: SpeechToTextService) {}

    async processAudioFile(audioFile: string) {
        const audioBuffer = fs.readFileSync(path.resolve(audioFile));
        const transcription = await this.speechToTextService.transcribe(audioBuffer);
        return transcription;
    }
}
