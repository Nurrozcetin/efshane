import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { UpdateProgressDto } from "./dto/update-progress.dto"; 

@Controller('progress')
export class ProgressController{
    constructor(private readonly progressService: ProgressService) {}
    @Post()
    async updateProgress(
        @Body() updateProgressDto: UpdateProgressDto
    ) {
        return this.progressService.updateProgress(updateProgressDto);
    }

    @Get(':userId/:bookId')
    async getProgress(
        @Param('userId') userId: string, 
        @Param('bookId') bookId: string,
    ) {
        const userID = parseInt(userId, 10);
        const bookID = parseInt(bookId, 10);
        return  this.progressService.getProgress(userID, bookID);

    }
}