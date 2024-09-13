import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { AudioBookService } from "./audioBook.service";
import { CreateAudioBookDto } from "./dto/create-audioBook.dto";
import { UpdateAudioBookDto } from "./dto/update-audiobook.dto";

@Controller('audioBook')
export class  AudioBookController {
    constructor(private readonly audioBookService: AudioBookService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAudioBook(
        @Body() body: CreateAudioBookDto,
        @Req() req
    ){
        const authorId = req.user.id;
        return this.audioBookService.createAudioBook(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllAudioBook(
        @Req() req
    ) {
        const authorID = req.user.id;
        return this.audioBookService.getAllAudioBook(String(authorID));
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':audioBookId')
    async deleteAudioBook(
        @Param('audioBookId') audioBookId: number, 
        @Req() req) 
    {
        const authorId = req.user.id;
        return this.audioBookService.deleteAudioBook(String(audioBookId), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':audioBookId')
    async updateAudioBook(
        @Param('audioBookId') audioBookId: number, 
        @Body() body: UpdateAudioBookDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        return this.audioBookService.updateAudioBook(String(audioBookId), body, authorId);
    }
}
