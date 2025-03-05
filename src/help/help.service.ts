import { Injectable, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HelpService {
    private readonly endpoint = "https://models.inference.ai.azure.com";   
    private readonly modelName = 'gpt-4o-mini';
    private readonly apiKey = process.env['GITHUB_TOKEN'];

    async getChatResponse(userInput: string, currentContent: string): Promise<string> {
        try {
            const response = await axios.post(
                `${this.endpoint}/chat/completions`,
                {
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant for creative writing. Your task is to continue the story from where it left off. Do not repeat the previous content. Only add new text to extend the story.'
                        },
                        {
                            role: 'user',
                            content: `The story so far is: "${currentContent}". Continue the story logically and creatively from this point without repeating any part of the given content.`
                        },
                        {
                            role: 'user',
                            content: `Additional instruction: "${userInput}".`
                        }
                    ],
                
                    temperature: 1.0,
                    top_p: 1.0,
                    max_tokens: 1000,
                    model: this.modelName,
                    stop: [`"${currentContent}"`]
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                },
            );
            console.log(response.data.choices[0].message.content);
            return response.data.choices[0].message.content;
        } catch (error) {
            throw new HttpException(
                'Error communicating with OpenAI API',
                HttpStatus.BAD_REQUEST,
            );  
        }
    }
}