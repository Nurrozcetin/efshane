import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateBookCategoryDto } from "./dto/assign-book-category.dto";

@Controller('categories')
export class CategoryController{
    constructor(private readonly categoryService: CategoryService) {}

    @Post('assignBook')
    async assignCategoriesToBook(@Body() createBookCategoryDto:  CreateBookCategoryDto) {
        const {bookId, categoryIds} = createBookCategoryDto;
        return this.categoryService.assignCategoriesToBook(bookId, categoryIds);
    }

    @Get('book/:bookId')
    async getCategoriesByBook(@Param('bookId') bookId: string) {
        const bookID = parseInt(bookId, 10);
        return await this.categoryService.getCategoriesByBook(bookID);
    }

    @Post('assignAudioBook')
    async assignCategoriesToAudioBook(@Body() createBookCategoryDto:  CreateBookCategoryDto) {
        const {audioBookId, categoryIds} = createBookCategoryDto;
        return this.categoryService.assignCategoriesToAudioBook(audioBookId, categoryIds);
    }

    @Get('audioBook/:audioBookId')
    async getCategoriesByAudioBook(@Param('audioBookId') audioBookId: string) {
        const audioBookID = parseInt(audioBookId, 10);
        return await this.categoryService.getCategoriesByAudioBook(audioBookID);
    }
}