import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EpisodeService } from "./episode.service";
import { FileService } from "./file.service";
import { ModerationService } from "./moderation.service";
import { SpeechToTextService } from "./speech-to-text.service";

Module({
    providers: [EpisodeService, PrismaService, FileService, ModerationService, SpeechToTextService],
    exports: [EpisodeService],
})
export class EpisodeModule {}