import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { SectionService } from "./section.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { CreateSectionDto } from "./dto/create-section.dto";

@Controller('section')
export class  SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSection(@Param('bookId') bookId: number, @Body() body: CreateSectionDto, @Req() req)
    {
        const authorId = req.user.id;
        return this.sectionService.createSection(body, authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':authorId/:bookId')
    async getAllSectionsByBookId(
        @Param('authorId') authorId: number,
        @Param('bookId') bookId: number,
    ) {
        return this.sectionService.getAllSectionsByBookId(String(authorId), String(bookId));
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':bookId/:sectionsId')
    async deleteSectionsByBookId(@Param('bookId') bookId: number, @Param('sectionsId') sectionsId: number, @Body() body: CreateSectionDto, @Req() req) 
    {
        const authorId = req.user.id;
        return this.sectionService.deleteAllSectionsByBookId(String(bookId), String(sectionsId), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookId/:sectionsId')
    async updateAllSectionsByBookId(@Param('bookId')  bookId: number, @Param('sectionsId')  sectionsId: number, @Body() body: CreateSectionDto, @Req() req
    ){
        const authorId = req.user.id;
        return this.sectionService.updateAllSectionsByBookId(String(bookId), String(sectionsId), body, authorId);
    }
}
