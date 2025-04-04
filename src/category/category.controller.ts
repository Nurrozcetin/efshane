import { Body, Controller, Get, Header, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateBookCategoryDto } from "./dto/assign-book-category.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guards";

@Controller('categories')
export class CategoryController{
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Post('assignBook')
    async assignCategoriesToBook(@Body() createBookCategoryDto:  CreateBookCategoryDto) {
        const {bookId, categoryIds} = createBookCategoryDto;
        return this.categoryService.assignCategoriesToBook(bookId, categoryIds);
    }

    @UseGuards(JwtAuthGuard)
    @Get('book/:bookId')
    async getCategoriesByBook(@Param('bookId') bookId: string) {
        const bookID = parseInt(bookId, 10);
        return await this.categoryService.getCategoriesByBook(bookID);
    }

    @Patch('book/:bookId')
    async updateCategoriesForBook(
        @Param('bookId') bookId: string,
        @Body() createBookCategoryDto: CreateBookCategoryDto,
    ) {
        const bookID = parseInt(bookId, 10); 
        return await this.categoryService.updateCategoriesForBook(bookID, createBookCategoryDto.categoryIds);
    }

    @UseGuards(JwtAuthGuard)
    @Post('assignAudioBook')
    async assignCategoriesToAudioBook(@Body() createBookCategoryDto: CreateBookCategoryDto) {
        const {audioBookId, categoryIds} = createBookCategoryDto;
        return this.categoryService.assignCategoriesToAudioBook(audioBookId, categoryIds);
    }

    @UseGuards(JwtAuthGuard)
    @Get('audioBook/:audioBookId')
    async getCategoriesByAudioBook(@Param('audioBookId') audioBookId: string) {
        const audioBookID = parseInt(audioBookId, 10);
        return await this.categoryService.getCategoriesByAudioBook(audioBookID);
    }

    @Patch('audioBook/:audioBookId')
    async updateCategoriesForAudioBook(
        @Param('audioBookId') audioBookId: string,
        @Body() createBookCategoryDto: CreateBookCategoryDto,
    ) {
        const audioBookID = parseInt(audioBookId, 10); 
        return await this.categoryService.updateCategoriesForAudioBook(audioBookID, createBookCategoryDto.categoryIds);
    }

    @Post('user')
    async assignCategoriesToUser(
        @Body() createBookCategoryDto:  CreateBookCategoryDto
    ) {
        const {email, categoryIds} = createBookCategoryDto;
        return this.categoryService.assignCategoriesToUser(email, categoryIds);
    }

    @UseGuards(JwtAuthGuard)
    @Get('getUser')
    async getCategoriesByUser(
        @Req() req
    ) {
        const userId = req.user.id;
        return await this.categoryService.getCategoriesByUser(userId);
    }

    @Get()
    async getAllCategories() {
        return await this.categoryService.getAllCategories();
    }

    @Get('getBookByCategory/:categoryName')
    @Header('Cache-Control', 'no-store') 
    async getBookByCategories(
        @Param('categoryName') categoryName: string, 
    ) {
        return await this.categoryService.getBookByCategories(categoryName); 
    }

}