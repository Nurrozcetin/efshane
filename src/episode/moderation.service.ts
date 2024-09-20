import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ModerationService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });
    }

    async moderateContent(audioText: string): Promise<string[]> {
        const moderationResult = await this.openai.moderations.create({
            input: audioText, 
        });

        const flaggedCategories: string[] = [];

        moderationResult.results.forEach(result => {
            if (result.flagged) {
                const flaggedInResult = Object.keys(result.categories).filter(
                    category => result.categories[category] === true
                );
                flaggedCategories.push(...flaggedInResult);
            }
        });
        return flaggedCategories;
    }
}
