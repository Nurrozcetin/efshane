import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AnnouncementService } from "./anons.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateAnnouncementDto } from "./dto/create-anons.dto";

@Controller('anons')
export class AnnouncementController {
    constructor(
        private readonly announcementService: AnnouncementService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createAnnouncement(
    @Body() body: CreateAnnouncementDto,
    @Req() req) 
    {
        const authorId = req.user.id; 
        return this.announcementService.createAnnouncement(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('allAnons')
    async getAnnonsByAuthorId(
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.announcementService.getAllNAnnonsByAuthorId(authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':anonsId')
    async deleteAllAnnonsByAuthorId(
        @Param('anonsId')  anonsId: string,
        @Req() req
    ){
        const authorId = req.user.id;
        return this.announcementService.deleteAllAnnonsByAuthorId(authorId, anonsId);
    }

    @Get('user/:username')
    async getAnonsByAuthorUsername(
        @Param('username') username: string
    ) {
        return this.announcementService.getAnonsByAuthorUsername(username);
    }
}