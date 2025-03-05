import { Controller, Get, Res, HttpStatus, Body, Post, UseGuards, Req } from '@nestjs/common';
import { HelpService } from './help.service';
@Controller('openai')
export class HelpController {
    constructor(private readonly helpService: HelpService) {}

    @Post()
    async getChatResponse(
        @Body('input') input: string,
        @Body('content') content: string,
    ) {
        if (!input || !content) {
            return ('Input and content fields are required.');
        }
        try {
            const result = await this.helpService.getChatResponse(input, content);
            console.log(result);
            return { updatedContent: `${content} ${result}` };
        } catch (error) {
            return { message: error.message};
        }
    }
}
