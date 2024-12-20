import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EpisodeService } from "./episode.service";
import { MulterModule } from "@nestjs/platform-express";
import { EpisodeController } from "./episode.controller";

Module({
    providers: [EpisodeService, PrismaService],
    exports: [EpisodeService],
    imports:[
        MulterModule.register({
            dest: './uploads',
        })
    ],
    controllers: [EpisodeController]
})
export class EpisodeModule {}