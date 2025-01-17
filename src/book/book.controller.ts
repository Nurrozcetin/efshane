import { BookService } from './book.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express'

const storage = diskStorage({
    destination: './uploads', 
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop(); 
        callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});

@Controller('book')
export class  BookController {
    constructor(private readonly bookService: BookService) {}
    @Get('search')
    async search(
        @Query('query') query: string,  
    ) {
        return this.bookService.search(query);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('allBooks')
    async getBooksByAuthorId(
        @Req() req
    ) {
        const authorId = req.user.id;
        return this.bookService.getBooksByAuthorId(authorId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('toggle/:bookTitle')
    async togglePublish(
        @Param('bookTitle') bookTitle: string, 
        @Req() req
    ){

        const authorId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        const book = await this.bookService.togglePublish(decodedTitle, authorId);
        return book;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('bookCover', {
            storage,
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error('Invalid file type'), false);
                }
            },
        }),
    )
    async createBook(
        @UploadedFile() bookCover: Express.Multer.File,
        @Body() body: CreateBookDto,
        @Req() req
    ){
        const authorId = req.user.id;
        const bookCoverPath = bookCover?.path;
        const isAudioBook = body.isAudioBook === true;
        return this.bookService.createBook({...body, isAudioBook, bookCover: bookCoverPath }, authorId);
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
        @Param('bookId') bookId: string, 
        @Req() req) 
    {
        const authorId = req.user.id;
        return this.bookService.deleteBook(bookId.toString(), authorId);
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

    @UseGuards(JwtAuthGuard)
    @Get(':bookTitle')
    async getBookByTitle(
        @Param('bookTitle') bookTitle: string,  
        @Req() req
    ) {
        const decodedTitle = decodeURIComponent(bookTitle);
        const userId = req.user.id;
        return this.bookService.getBookByTitle(decodedTitle, userId);
    }

    @Get('profile/other/:username')
    async getBookByAuthorUsername(
        @Param('username') username: string) {
        return this.bookService.getBookByAuthorUsername(username);
    }

    @UseGuards(JwtAuthGuard)
    @Get('details/bookDetails/:bookTitle')
    async getBookDetailsByTitle(
        @Param('bookTitle') bookTitle: string,  
        @Req() req
    ) {
        const userId = req.user.id;
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.bookService.getBookDetailsByTitle(decodedTitle, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('like/:bookTitle')
    async likeBook(
        @Param('bookTitle') bookTitle: string, 
        @Req() req
    ) {
        const userId = req.user.id; 
        const decodedTitle = decodeURIComponent(bookTitle);
        return this.bookService.toggleLikeBook(decodedTitle, userId);
    }
}