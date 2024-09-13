import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AudioBookService } from "./audioBook.service";

Module({
    providers: [AudioBookService, PrismaService],
    exports: [AudioBookService],
})
export class AudioBookModule {}