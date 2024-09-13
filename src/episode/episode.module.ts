import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EpisodeService } from "./episode.service";

Module({
    providers: [EpisodeService, PrismaService],
    exports: [EpisodeService],
})
export class EpisodeModule {}