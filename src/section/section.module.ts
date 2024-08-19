import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
    providers: [SectionService, PrismaService],
    exports: [SectionService],
})
export class SectionModule {}
