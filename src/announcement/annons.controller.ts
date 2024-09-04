import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AnnouncementService } from "./anons.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateAnnouncementDto } from "./dto/create-anons.dto";

@Controller('annons')
export class AnnouncementController {
    constructor(
        private readonly announcementService: AnnouncementService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAnnouncement(
    @Param('bookId') bookId: number, 
    @Body() body: CreateAnnouncementDto,
    @Req() req) 
    {
        const authorId = req.user.id; 
        return this.announcementService.createAnnouncement(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':authorId')
    async getAnnonsByAuthorId(
        @Param('authorId') authorId: number,
    ) {
        return this.announcementService.getAllNAnnonsByAuthorId(String(authorId));
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':authorId/:annonsId')
    async deleteAllAnnonsByAuthorId(@Param('authorId')  authorId: number,
    @Param('annonsId')  annonsId: number,
    @Body() body: CreateAnnouncementDto
    ){
        return this.announcementService.deleteAllAnnonsByAuthorId(String(authorId), String(annonsId));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':authorId/:annonsId')
    async updateAllNotesByBookId(@Param('authorId')  authorId: number,
    @Param('annonsId')  annonsId: number,
    @Body() body: CreateAnnouncementDto
    ){
        return this.announcementService.updateAllAnnonsByAuthorId(String(authorId), String(annonsId), body);
    }
}