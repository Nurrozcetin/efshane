import { BookService } from './book.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

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

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBook(
        @Req() req
    ) {
        const authorID = req.user.id;
        return this.bookService.getAllBook(String(authorID));
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
    @Put(':bookId')
    async updateBook(
        @Param('bookId') bookId: number, 
        @Body() body: UpdateBookDto, 
        @Req() req
    ){
        const authorId = req.user.id;
        return this.bookService.updateBook(String(bookId), body, authorId);
    }
}
