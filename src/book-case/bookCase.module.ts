import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BookCaseService } from "./bookCase.service";

Module({
    providers: [BookCaseService, PrismaService],
    exports: [BookCaseService],
})
export class BookCaseModule {}