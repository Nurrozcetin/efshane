import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { SectionService } from "./section.service";
import { CreateSectionDto } from "./dto/create-section.dto";

@Controller('sections')
export class SectionController {
    constructor(
        private readonly sectionService: SectionService,
    ) {}

    @Get()
    async getSection(): Promise<any> {
        return this.sectionService.getAllSection();
    }

    @Post()
    async createSection(@Body() body: CreateSectionDto) {
        return  this.sectionService.createSection(body);
    }

    @Get(':bookId')
    getSectionByBookId(@Param('bookId') bookId:number){
        return this.sectionService.getAllSectionsByBookId(String(bookId));
    }

    @Delete(':bookId')
    deleteSectionByBookId(@Param('bookId') bookId:number){
        return this.sectionService.deleteAllSectionsByBookId(String(bookId));
    }

    @Delete('section/:sectionId')
    deleteSectionById(@Param('sectionId') id:number){
        return this.sectionService.deleteSectionById(String(id));
    }
}