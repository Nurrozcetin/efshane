import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BookService } from "./book.service";

Module({
    providers: [BookService, PrismaService],
    exports: [BookService],
})
export class BookModule {}