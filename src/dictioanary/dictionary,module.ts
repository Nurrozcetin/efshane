import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DictionaryService } from './dictionary.service';

@Module({
    imports: [HttpModule],
    providers: [DictionaryService]
})
export class DictionaryModule {}
