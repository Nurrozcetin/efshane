import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { LibraryService } from "./library.service";

Module({
    providers: [LibraryService, PrismaService],
    exports: [LibraryService],
})
export class LibraryModule {}