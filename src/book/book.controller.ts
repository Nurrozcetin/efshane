import { BookService } from './book.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class  BookController {
    constructor(private readonly bookService: BookService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createBook(
        @Body() body: CreateBookDto,
        @Req() req
    ){
        const authorId = req.user.id;
        return this.bookService.createBook(body, authorId);
    }

    @Get('ageRange')
    async getAgeRange(
    ) {
        return this.bookService.getAgeRange();
    }

    @Get('copyright')
    async getCopyRight(
    ) {
        return this.bookService.getCopyRight();
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getAllBookByAuthor(
        @Req() req
    ) {
        const authorID = req.user.id;
        return this.bookService.getAllBookByAuthor(String(authorID));
    }

    @Get()
    async getAllBook() {
        return this.bookService.getAllBook();
    }

    @Get('trend')
    async getTrendsBook() {
        return this.bookService.getTrendsBook();
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':bookId')
    async deleteBook(
        @Param('bookId') bookId: number, 
        @Req() req) 
    {
        const authorId = req.user.id;
        return this.bookService.deleteBook(String(bookId), authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':bookTitle')
    async updateBook(
        @Param('bookTitle') bookTitle: string,  
        @Body() body: UpdateBookDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.bookService.updateBook(decodedTitle, body, authorId);
    }
}