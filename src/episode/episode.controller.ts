import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateEpisodeDto } from "./dto/create-episode.dto";
import { EpisodeService } from "./episode.service";
import { UpdateEpisodeDto } from "./dto/update-episode.dto";

@Controller('episode')
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':audiobookId')
    async createEpisodeByAudioBook(
        @Param('audiobookId') audiobookId: string, 
        @Body() body: CreateEpisodeDto, 
        @Req() req
    ) {
        const audiobookID = parseInt(audiobookId, 10);
        const authorId = req.user.id;
        return this.episodeService.createEpisodeByAudioBook(body, authorId, audiobookID);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':authorId/:audiobookId')
    async getAllEpisodesByAudioBookId(
        @Param('authorId') authorId: number,
        @Param('audiobookId') audiobookId: number,
    ) {
        return this.episodeService.getAllEpisodesByAudioBookId(String(authorId), String(audiobookId));
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':audiobookId/:episodesId')
    async deleteAllEpisodesByAudioBookId(
        @Param('audiobookId') audiobookId: number, 
        @Param('episodesId') episodesId: number, 
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.episodeService.deleteAllEpisodesByAudioBookId(String(audiobookId), String(episodesId), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':audiobookId/:episodesId')
    async updateAllEpisodesByAudioBookId(
        @Param('audiobookId') audiobookId: number, 
        @Param('episodesId') episodesId: number, 
        @Body() body: UpdateEpisodeDto, 
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.episodeService.updateAllEpisodesByAudioBookId(String(audiobookId), String(episodesId), body, authorId);
    }
}
