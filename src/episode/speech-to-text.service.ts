import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { Buffer } from 'buffer';

@Injectable()
export class SpeechToTextService {
    private client: SpeechClient;

    constructor() {
        this.client = new SpeechClient();
    }

    async transcribe(audioBuffer: Buffer): Promise<string> {
        const audioBytes = audioBuffer.toString('base64');

        const [response] = await this.client.recognize({
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
            audio: {
                content: audioBytes,
            },
        });

        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        return transcription;
    }
}
